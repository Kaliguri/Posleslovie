"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";

import {
  cmsContentSchemas,
  getCmsSchemaBySlug,
  type CmsContentSchema,
} from "@/shared/config/cms-content-schemas";

type ContentApiResponse = {
  slug: string;
  title: string;
  data: Record<string, unknown>;
  updatedAt?: string;
};

type ContentRevisionResponse = {
  id: number;
  slug: string;
  title: string;
  data: Record<string, unknown>;
  actor: string;
  reason: string;
  createdAt: string;
};

type MediaLibraryResponse = {
  images: string[];
};

type SaveDataUrlResponse = {
  publicPath: string;
};

type JsonLike = string | number | boolean | null | JsonLike[] | { [key: string]: JsonLike };
type JsonPath = Array<string | number>;
type PreviewViewport = "desktop" | "tablet" | "mobile";

const contentApiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const localStorageApiKey = "posleslovie:cms-api-key";

function prettyJson(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

function toPreviewImageSrc(source: string): string {
  if (source.startsWith("http://") || source.startsWith("https://") || source.startsWith("data:")) {
    return source;
  }
  if (source.startsWith("/")) {
    return `${basePath}${source}`;
  }
  return source;
}

function sanitizeJsonClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export default function ContentAdminPage() {
  const initialSchema = cmsContentSchemas[0];
  const [selectedSlug, setSelectedSlug] = useState(initialSchema?.slug ?? "home-hero");
  const [apiKey, setApiKey] = useState(() => {
    if (typeof window === "undefined") {
      return "";
    }
    return window.localStorage.getItem(localStorageApiKey) ?? "";
  });
  const [title, setTitle] = useState(initialSchema?.title ?? "");
  const [contentData, setContentData] = useState<Record<string, JsonLike>>(
    (initialSchema?.defaultValue ?? {}) as Record<string, JsonLike>,
  );
  const [statusMessage, setStatusMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [projectImages, setProjectImages] = useState<string[]>([]);
  const [history, setHistory] = useState<ContentRevisionResponse[]>([]);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [sitePreviewKey, setSitePreviewKey] = useState(0);
  const [previewViewport, setPreviewViewport] = useState<PreviewViewport>("desktop");
  const [previewHeight, setPreviewHeight] = useState(760);
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(false);

  const selectedSchema: CmsContentSchema | undefined = useMemo(
    () => getCmsSchemaBySlug(selectedSlug),
    [selectedSlug],
  );

  const previewWidthPx = useMemo(() => {
    if (previewViewport === "mobile") {
      return 390;
    }
    if (previewViewport === "tablet") {
      return 820;
    }
    return 1366;
  }, [previewViewport]);

  const loadContentForSchema = useCallback(
    async (schema: CmsContentSchema, options?: { silent?: boolean }) => {
      if (!contentApiBaseUrl) {
        return;
      }

      if (!options?.silent) {
        setIsLoading(true);
        setStatusMessage("");
      }

      try {
        const response = await fetch(`${contentApiBaseUrl}/public/content/${schema.slug}`, {
          cache: "no-store",
        });

        if (!response.ok) {
          setTitle(schema.title);
          setContentData(schema.defaultValue as Record<string, JsonLike>);
          if (!options?.silent) {
            setStatusMessage("Контент не найден в БД, загружен шаблон по умолчанию.");
          }
          return;
        }

        const payload = (await response.json()) as ContentApiResponse;
        setTitle(payload.title ?? schema.title);
        setContentData((payload.data ?? schema.defaultValue) as Record<string, JsonLike>);
        setLastSavedAt(payload.updatedAt ?? null);
      } catch {
        setTitle(schema.title);
        setContentData(schema.defaultValue as Record<string, JsonLike>);
        if (!options?.silent) {
          setStatusMessage("Не удалось загрузить контент из API. Проверьте backend.");
        }
      } finally {
        if (!options?.silent) {
          setIsLoading(false);
        }
      }
    },
    [],
  );

  const loadRevisionHistory = useCallback(async (slug: string) => {
    if (!contentApiBaseUrl || !apiKey.trim()) {
      setHistory([]);
      return;
    }
    setIsHistoryLoading(true);
    try {
      const response = await fetch(`${contentApiBaseUrl}/admin/content/${slug}/history?limit=15`, {
        headers: {
          "x-api-key": apiKey.trim(),
        },
      });
      if (!response.ok) {
        setHistory([]);
        return;
      }
      const payload = (await response.json()) as ContentRevisionResponse[];
      setHistory(Array.isArray(payload) ? payload : []);
    } catch {
      setHistory([]);
    } finally {
      setIsHistoryLoading(false);
    }
  }, [apiKey]);

  useEffect(() => {
    if (!selectedSchema) {
      return;
    }
    const timer = window.setTimeout(() => {
      void loadContentForSchema(selectedSchema);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [selectedSchema, loadContentForSchema]);

  useEffect(() => {
    if (!selectedSchema) {
      return;
    }
    const timer = window.setTimeout(() => {
      void loadRevisionHistory(selectedSchema.slug);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [selectedSchema, loadRevisionHistory]);

  useEffect(() => {
    if (!contentApiBaseUrl || !apiKey.trim()) {
      return;
    }

    const controller = new AbortController();

    async function loadImageLibrary() {
      try {
        const response = await fetch(`${contentApiBaseUrl}/admin/media/library`, {
          headers: {
            "x-api-key": apiKey.trim(),
          },
          signal: controller.signal,
        });
        if (!response.ok) {
          return;
        }
        const payload = (await response.json()) as MediaLibraryResponse;
        if (Array.isArray(payload.images)) {
          setProjectImages(payload.images);
        }
      } catch {
        // Keep editor usable without media library.
      }
    }

    void loadImageLibrary();
    return () => controller.abort();
  }, [apiKey]);

  function handleSlugChange(nextSlug: string) {
    const schema = getCmsSchemaBySlug(nextSlug);
    setSelectedSlug(nextSlug);
    if (!schema) {
      return;
    }
    setTitle(schema.title);
    setContentData(schema.defaultValue as Record<string, JsonLike>);
    setStatusMessage("");
    setLastSavedAt(null);
  }

  async function handleSave() {
    if (!contentApiBaseUrl || !selectedSchema) {
      setStatusMessage("NEXT_PUBLIC_API_BASE_URL не задан. Сохранение недоступно.");
      return;
    }

    if (!apiKey.trim()) {
      setStatusMessage("Введите API-ключ администратора перед сохранением.");
      return;
    }

    setIsSaving(true);
    setStatusMessage("");
    try {
      const response = await fetch(`${contentApiBaseUrl}/admin/content/${selectedSchema.slug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey.trim(),
        },
        body: JSON.stringify({
          title: title || selectedSchema.title,
          data: contentData,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        setStatusMessage(`Ошибка сохранения: ${response.status} ${errorText}`);
        return;
      }

      window.localStorage.setItem(localStorageApiKey, apiKey.trim());
      await loadContentForSchema(selectedSchema, { silent: true });
      await loadRevisionHistory(selectedSchema.slug);
      setSitePreviewKey((current) => current + 1);
      setStatusMessage("Сохранено успешно. Превью обновлено.");
    } catch {
      setStatusMessage("Сетевая ошибка при сохранении. Проверьте backend/API URL.");
    } finally {
      setIsSaving(false);
    }
  }

  function updateAtPath(current: JsonLike, path: JsonPath, updater: (value: JsonLike) => JsonLike): JsonLike {
    if (path.length === 0) {
      return updater(current);
    }

    const [head, ...tail] = path;
    if (typeof head === "number") {
      const sourceArray = Array.isArray(current) ? [...current] : [];
      sourceArray[head] = updateAtPath((sourceArray[head] ?? null) as JsonLike, tail, updater);
      return sourceArray;
    }

    const sourceObject =
      current && typeof current === "object" && !Array.isArray(current)
        ? { ...(current as Record<string, JsonLike>) }
        : {};
    sourceObject[head] = updateAtPath((sourceObject[head] ?? null) as JsonLike, tail, updater);
    return sourceObject;
  }

  function getValueByPath(current: JsonLike, path: JsonPath): JsonLike {
    let cursor: JsonLike = current;
    for (const key of path) {
      if (typeof key === "number") {
        if (!Array.isArray(cursor)) {
          return null;
        }
        cursor = (cursor[key] ?? null) as JsonLike;
      } else {
        if (!cursor || typeof cursor !== "object" || Array.isArray(cursor)) {
          return null;
        }
        cursor = ((cursor as Record<string, JsonLike>)[key] ?? null) as JsonLike;
      }
    }
    return cursor;
  }

  function setValueByPath(path: JsonPath, value: JsonLike) {
    setContentData((current) => updateAtPath(current as JsonLike, path, () => value) as Record<string, JsonLike>);
  }

  function updateArrayAtPath(path: JsonPath, updater: (array: JsonLike[]) => JsonLike[]) {
    setContentData(
      (current) =>
        updateAtPath(current as JsonLike, path, (existing) => {
          const arrayValue = Array.isArray(existing) ? [...existing] : [];
          return updater(arrayValue);
        }) as Record<string, JsonLike>,
    );
  }

  function isImageField(fieldLabel: string, fieldValue: string): boolean {
    const lowerLabel = fieldLabel.toLowerCase();
    const byLabel = lowerLabel.includes("image") || lowerLabel.includes("icon") || lowerLabel.includes("background");
    const byValue =
      fieldValue.startsWith("/images/") ||
      fieldValue.startsWith("data:image/") ||
      /\.(png|jpe?g|webp|gif|svg)$/i.test(fieldValue);
    return byLabel || byValue;
  }

  function slugify(value: string): string {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9-_]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40);
  }

  async function uploadDataUrlToProject(path: JsonPath, label: string, dataUrl: string): Promise<void> {
    if (!contentApiBaseUrl) {
      setStatusMessage("NEXT_PUBLIC_API_BASE_URL не задан. Загрузка недоступна.");
      return;
    }
    if (!apiKey.trim()) {
      setStatusMessage("Введите API-ключ администратора перед загрузкой.");
      return;
    }
    if (!dataUrl.startsWith("data:image/")) {
      setStatusMessage("Сначала выберите локальный файл (или вставьте data:image).");
      return;
    }

    setIsUploading(true);
    setStatusMessage("");
    try {
      const response = await fetch(`${contentApiBaseUrl}/admin/media/save-data-url`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey.trim(),
        },
        body: JSON.stringify({
          dataUrl,
          fileName: `${selectedSlug}-${slugify(label) || "image"}`,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        setStatusMessage(`Ошибка загрузки файла: ${response.status} ${errorText}`);
        return;
      }

      const payload = (await response.json()) as SaveDataUrlResponse;
      if (!payload.publicPath) {
        setStatusMessage("Сервер не вернул путь файла.");
        return;
      }

      setValueByPath(path, payload.publicPath);
      setProjectImages((current) =>
        current.includes(payload.publicPath) ? current : [...current, payload.publicPath].sort(),
      );
      setStatusMessage(`Файл загружен: ${payload.publicPath}`);
    } catch {
      setStatusMessage("Сетевая ошибка при загрузке файла.");
    } finally {
      setIsUploading(false);
    }
  }

  async function restoreRevision(revisionId: number) {
    if (!contentApiBaseUrl || !selectedSchema) {
      return;
    }
    if (!apiKey.trim()) {
      setStatusMessage("Введите API-ключ администратора перед восстановлением.");
      return;
    }

    setStatusMessage("");
    try {
      const response = await fetch(
        `${contentApiBaseUrl}/admin/content/${selectedSchema.slug}/restore/${revisionId}`,
        {
          method: "POST",
          headers: {
            "x-api-key": apiKey.trim(),
          },
        },
      );
      if (!response.ok) {
        const errorText = await response.text();
        setStatusMessage(`Ошибка восстановления: ${response.status} ${errorText}`);
        return;
      }

      await loadContentForSchema(selectedSchema, { silent: true });
      await loadRevisionHistory(selectedSchema.slug);
      setSitePreviewKey((current) => current + 1);
      setStatusMessage(`Версия #${revisionId} восстановлена.`);
    } catch {
      setStatusMessage("Сетевая ошибка при восстановлении версии.");
    }
  }

  function renderEditor(value: JsonLike, path: JsonPath, label: string): ReactNode {
    if (typeof value === "string") {
      const isLong = value.length > 80 || value.includes("\n");
      const isImage = isImageField(label, value);
      return (
        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium text-slate-600">{label}</span>
          {isImage ? (
            <div className="mb-2 overflow-hidden rounded-lg border border-slate-200 bg-slate-100 p-2">
              {value ? (
                <img
                  src={toPreviewImageSrc(value)}
                  alt={label}
                  className="h-36 w-full rounded object-contain"
                />
              ) : (
                <div className="flex h-36 items-center justify-center rounded bg-slate-100 text-xs text-slate-500">
                  Нет изображения
                </div>
              )}
            </div>
          ) : null}
          {isLong ? (
            <textarea
              className="min-h-[84px] rounded-lg border border-slate-300 px-2 py-1 text-sm"
              value={value}
              onChange={(event) => setValueByPath(path, event.target.value)}
            />
          ) : (
            <input
              className="rounded-lg border border-slate-300 px-2 py-1 text-sm"
              value={value}
              onChange={(event) => setValueByPath(path, event.target.value)}
            />
          )}
          {isImage ? (
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <label className="cursor-pointer rounded-lg border border-slate-300 px-3 py-1 text-xs">
                Выбрать файл
                <input
                  className="hidden"
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (!file) {
                      return;
                    }
                    const reader = new FileReader();
                    reader.onload = () => {
                      const result = reader.result;
                      if (typeof result === "string") {
                        setValueByPath(path, result);
                      }
                    };
                    reader.readAsDataURL(file);
                  }}
                />
              </label>
              <button
                className="rounded-lg border border-slate-300 px-3 py-1 text-xs disabled:opacity-50"
                type="button"
                disabled={isUploading || !value.startsWith("data:image/")}
                onClick={() => void uploadDataUrlToProject(path, label, value)}
              >
                {isUploading ? "Загрузка..." : "Загрузить в проект"}
              </button>
              <select
                className="rounded-lg border border-slate-300 px-2 py-1 text-xs"
                value=""
                onChange={(event) => {
                  const selected = event.target.value;
                  if (!selected) {
                    return;
                  }
                  setValueByPath(path, selected);
                  event.target.value = "";
                }}
              >
                <option value="">Выбрать из проекта</option>
                {projectImages.map((imagePath) => (
                  <option key={imagePath} value={imagePath}>
                    {imagePath}
                  </option>
                ))}
              </select>
            </div>
          ) : null}
        </label>
      );
    }

    if (typeof value === "number") {
      return (
        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium text-slate-600">{label}</span>
          <input
            className="rounded-lg border border-slate-300 px-2 py-1 text-sm"
            type="number"
            value={value}
            onChange={(event) => setValueByPath(path, Number(event.target.value))}
          />
        </label>
      );
    }

    if (typeof value === "boolean") {
      return (
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={value}
            onChange={(event) => setValueByPath(path, event.target.checked)}
          />
          {label}
        </label>
      );
    }

    if (Array.isArray(value)) {
      return (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
            <button
              className="rounded-lg border border-slate-300 px-3 py-1 text-xs"
              type="button"
              onClick={() => {
                const template = value.length > 0 ? sanitizeJsonClone(value[0]) : ({} as JsonLike);
                updateArrayAtPath(path, (array) => [...array, template]);
              }}
            >
              Добавить элемент
            </button>
          </div>
          <div className="mt-2 space-y-3">
            {value.map((item, index) => (
              <div key={`${label}-${index}`} className="rounded-lg border border-slate-200 bg-white p-3">
                <div className="mb-2 flex flex-wrap gap-2">
                  <button
                    className="rounded border border-slate-300 px-2 py-1 text-[11px]"
                    type="button"
                    disabled={index === 0}
                    onClick={() =>
                      updateArrayAtPath(path, (array) => {
                        const next = [...array];
                        [next[index - 1], next[index]] = [next[index], next[index - 1]];
                        return next;
                      })
                    }
                  >
                    Вверх
                  </button>
                  <button
                    className="rounded border border-slate-300 px-2 py-1 text-[11px]"
                    type="button"
                    disabled={index === value.length - 1}
                    onClick={() =>
                      updateArrayAtPath(path, (array) => {
                        const next = [...array];
                        [next[index + 1], next[index]] = [next[index], next[index + 1]];
                        return next;
                      })
                    }
                  >
                    Вниз
                  </button>
                  <button
                    className="rounded border border-slate-300 px-2 py-1 text-[11px]"
                    type="button"
                    onClick={() =>
                      updateArrayAtPath(path, (array) => {
                        const next = [...array];
                        next.splice(index + 1, 0, sanitizeJsonClone(next[index]));
                        return next;
                      })
                    }
                  >
                    Дублировать
                  </button>
                  <button
                    className="rounded border border-rose-300 px-2 py-1 text-[11px] text-rose-700"
                    type="button"
                    onClick={() =>
                      updateArrayAtPath(path, (array) => {
                        const next = [...array];
                        next.splice(index, 1);
                        return next;
                      })
                    }
                  >
                    Удалить
                  </button>
                </div>
                {renderEditor(item as JsonLike, [...path, index], `${label}[${index}]`)}
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (value && typeof value === "object") {
      return (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
          <div className="mt-3 grid gap-3">
            {Object.entries(value).map(([key, nested]) => (
              <div key={`${label}-${key}`}>{renderEditor(nested as JsonLike, [...path, key], key)}</div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <label className="flex flex-col gap-1">
        <span className="text-xs font-medium text-slate-600">{label}</span>
        <input
          className="rounded-lg border border-slate-300 px-2 py-1 text-sm"
          value=""
          onChange={(event) => setValueByPath(path, event.target.value)}
        />
      </label>
    );
  }

  function renderInlinePreview(): ReactNode {
    if (selectedSlug === "home-hero") {
      const heading = String(getValueByPath(contentData, ["heading"]) ?? "");
      const leadLine1 = String(getValueByPath(contentData, ["leadLine1"]) ?? "");
      const leadLine2 = String(getValueByPath(contentData, ["leadLine2"]) ?? "");
      const backgroundImage = String(getValueByPath(contentData, ["backgroundImage"]) ?? "");
      return (
        <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
          <div className="overflow-hidden rounded-xl bg-slate-100 p-2">
            <img src={toPreviewImageSrc(backgroundImage)} alt="Hero" className="h-40 w-full object-contain" />
          </div>
          <p className="text-lg font-bold">{heading}</p>
          <p className="text-sm text-slate-600">{leadLine1}</p>
          <p className="text-sm text-slate-600">{leadLine2}</p>
        </div>
      );
    }

    if (selectedSlug === "home-galleries") {
      return (
        <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
          {(["bombs", "lavender", "packs"] as const).map((kind) => {
            const items = getValueByPath(contentData, [kind]);
            if (!Array.isArray(items)) {
              return null;
            }
            return (
              <div key={kind}>
                <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">{kind}</p>
                <div className="grid grid-cols-3 gap-2">
                  {items.slice(0, 3).map((item, index) => {
                    const image = String((item as { image?: unknown }).image ?? "");
                    return (
                      <div key={`${kind}-${index}`} className="overflow-hidden rounded-lg border border-slate-200 bg-slate-100 p-1">
                        <img src={toPreviewImageSrc(image)} alt={`${kind}-${index}`} className="h-24 w-full object-contain" />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <p className="text-sm text-slate-600">
          Быстрый превью-блок для этого slug показан в сыром виде. После сохранения справа ниже
          обновится живой iframe витрины.
        </p>
        <pre className="mt-3 max-h-[260px] overflow-auto rounded bg-slate-950 p-3 text-xs text-slate-100">
          {prettyJson(contentData)}
        </pre>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f8f8] px-4 py-8 text-[#0f172a] sm:px-8">
      <div className="mx-auto max-w-[1600px]">
        <h1 className="text-3xl font-semibold">Админка контента</h1>
        <p className="mt-2 text-sm text-slate-600">
          Inline preview + история версий + расширенный редактор массивов. Изображения в форме
          отображаются целиком (contain).
        </p>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_460px]">
          <section className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium">Контент-блок</span>
                <select
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
                  value={selectedSlug}
                  onChange={(event) => handleSlugChange(event.target.value)}
                >
                  {cmsContentSchemas.map((schema) => (
                    <option key={schema.slug} value={schema.slug}>
                      {schema.title}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium">API-ключ администратора</span>
                <input
                  className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
                  type="password"
                  placeholder="x-api-key"
                  value={apiKey}
                  onChange={(event) => setApiKey(event.target.value)}
                />
              </label>
            </div>

            <label className="mt-4 flex flex-col gap-2">
              <span className="text-sm font-medium">Заголовок записи</span>
              <input
                className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </label>

            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-medium">Описание схемы</p>
              <p className="mt-1 text-sm text-slate-600">{selectedSchema?.description}</p>
              {lastSavedAt ? (
                <p className="mt-2 text-xs text-slate-500">
                  Последнее подтвержденное сохранение: {new Date(lastSavedAt).toLocaleString()}
                </p>
              ) : null}
            </div>

            <div className="mt-4">{renderEditor(contentData, [], "data")}</div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                className="rounded-xl bg-[#102038] px-5 py-2 text-sm font-medium text-white disabled:opacity-50"
                type="button"
                disabled={isSaving || isLoading || isUploading}
                onClick={() => void handleSave()}
              >
                {isSaving ? "Сохраняем..." : "Сохранить"}
              </button>

              <button
                className="rounded-xl border border-slate-300 px-5 py-2 text-sm font-medium text-slate-700 disabled:opacity-50"
                type="button"
                disabled={isLoading || !selectedSchema}
                onClick={() => {
                  if (!selectedSchema) {
                    return;
                  }
                  setTitle(selectedSchema.title);
                  setContentData(selectedSchema.defaultValue as Record<string, JsonLike>);
                }}
              >
                Сбросить к шаблону
              </button>

              <button
                className="rounded-xl border border-slate-300 px-5 py-2 text-sm font-medium text-slate-700 disabled:opacity-50"
                type="button"
                disabled={isLoading}
                onClick={() => setStatusMessage(prettyJson(contentData))}
              >
                Показать JSON
              </button>

              {isLoading ? <span className="text-sm text-slate-500">Загрузка...</span> : null}
            </div>

            {statusMessage ? (
              <p className="mt-4 rounded-xl bg-slate-100 px-3 py-2 text-sm text-slate-700">
                {statusMessage}
              </p>
            ) : null}
          </section>

          <aside className="space-y-4">
            <div className="rounded-3xl bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Inline preview блока</h2>
                <button
                  className="rounded-lg border border-slate-300 px-3 py-1 text-xs"
                  type="button"
                  onClick={() => setSitePreviewKey((current) => current + 1)}
                >
                  Обновить витрину
                </button>
              </div>
              {renderInlinePreview()}
            </div>

            <div className="rounded-3xl bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-lg font-semibold">Preview сайта</h2>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    className="rounded-lg border border-slate-300 px-2 py-1 text-xs"
                    type="button"
                    onClick={() => setPreviewViewport("desktop")}
                  >
                    Desktop
                  </button>
                  <button
                    className="rounded-lg border border-slate-300 px-2 py-1 text-xs"
                    type="button"
                    onClick={() => setPreviewViewport("tablet")}
                  >
                    Tablet
                  </button>
                  <button
                    className="rounded-lg border border-slate-300 px-2 py-1 text-xs"
                    type="button"
                    onClick={() => setPreviewViewport("mobile")}
                  >
                    Mobile
                  </button>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button
                  className="rounded-lg border border-slate-300 px-3 py-1 text-xs"
                  type="button"
                  onClick={() => setIsPreviewExpanded(true)}
                >
                  Развернуть preview
                </button>
                <a
                  className="rounded-lg border border-slate-300 px-3 py-1 text-xs"
                  href={`${basePath || ""}/?cmsPreview=${sitePreviewKey}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Открыть в новой вкладке
                </a>
              </div>

              <label className="mt-3 flex items-center gap-3 text-xs text-slate-600">
                Высота preview
                <input
                  type="range"
                  min={520}
                  max={1200}
                  step={20}
                  value={previewHeight}
                  onChange={(event) => setPreviewHeight(Number(event.target.value))}
                />
                <span>{previewHeight}px</span>
              </label>

              <div className="mt-3 overflow-auto rounded-xl border border-slate-200 bg-slate-100 p-2">
                <iframe
                  key={sitePreviewKey}
                  src={`${basePath || ""}/?cmsPreview=${sitePreviewKey}`}
                  className="rounded-lg border border-slate-200 bg-white"
                  style={{
                    width: `${previewWidthPx}px`,
                    height: `${previewHeight}px`,
                    minWidth: "100%",
                  }}
                  title="Site preview"
                />
              </div>
            </div>

            <div className="rounded-3xl bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold">История версий</h2>
              {isHistoryLoading ? (
                <p className="mt-2 text-sm text-slate-500">Загружаем историю...</p>
              ) : history.length === 0 ? (
                <p className="mt-2 text-sm text-slate-500">
                  Версии пока не найдены (сохраните блок хотя бы один раз).
                </p>
              ) : (
                <div className="mt-3 space-y-2">
                  {history.map((revision) => (
                    <div key={revision.id} className="rounded-lg border border-slate-200 p-3">
                      <p className="text-xs text-slate-500">
                        #{revision.id} · {new Date(revision.createdAt).toLocaleString()}
                      </p>
                      <p className="text-xs text-slate-500">
                        actor: {revision.actor} · reason: {revision.reason}
                      </p>
                      <button
                        className="mt-2 rounded border border-slate-300 px-2 py-1 text-xs"
                        type="button"
                        onClick={() => void restoreRevision(revision.id)}
                      >
                        Восстановить эту версию
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>

      {isPreviewExpanded ? (
        <div className="fixed inset-0 z-50 bg-black/70 p-4">
          <div className="mx-auto h-full max-w-[1600px] rounded-2xl bg-white p-4 shadow-2xl">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h3 className="text-lg font-semibold">Большой preview сайта</h3>
              <button
                className="rounded-lg border border-slate-300 px-3 py-1 text-sm"
                type="button"
                onClick={() => setIsPreviewExpanded(false)}
              >
                Закрыть
              </button>
            </div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <button
                className="rounded-lg border border-slate-300 px-2 py-1 text-xs"
                type="button"
                onClick={() => setPreviewViewport("desktop")}
              >
                Desktop
              </button>
              <button
                className="rounded-lg border border-slate-300 px-2 py-1 text-xs"
                type="button"
                onClick={() => setPreviewViewport("tablet")}
              >
                Tablet
              </button>
              <button
                className="rounded-lg border border-slate-300 px-2 py-1 text-xs"
                type="button"
                onClick={() => setPreviewViewport("mobile")}
              >
                Mobile
              </button>
              <a
                className="rounded-lg border border-slate-300 px-2 py-1 text-xs"
                href={`${basePath || ""}/?cmsPreview=${sitePreviewKey}`}
                target="_blank"
                rel="noreferrer"
              >
                Открыть отдельно
              </a>
            </div>
            <div className="h-[calc(100%-88px)] overflow-auto rounded-xl border border-slate-200 bg-slate-100 p-2">
              <iframe
                key={`expanded-${sitePreviewKey}`}
                src={`${basePath || ""}/?cmsPreview=${sitePreviewKey}`}
                className="rounded-lg border border-slate-200 bg-white"
                style={{
                  width: `${previewWidthPx}px`,
                  height: "100%",
                }}
                title="Site preview expanded"
              />
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
