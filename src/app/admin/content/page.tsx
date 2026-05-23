"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";

import {
  cmsContentSchemas,
  getCmsSchemaBySlug,
  type CmsContentSchema,
} from "@/shared/config/cms-content-schemas";

type ContentApiResponse = {
  slug: string;
  title: string;
  data: Record<string, unknown>;
};
type MediaLibraryResponse = {
  images: string[];
};
type SaveDataUrlResponse = {
  publicPath: string;
};

type JsonLike = string | number | boolean | null | JsonLike[] | { [key: string]: JsonLike };
type JsonPath = Array<string | number>;

const contentApiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
const localStorageApiKey = "posleslovie:cms-api-key";

function prettyJson(value: unknown): string {
  return JSON.stringify(value, null, 2);
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
  const [projectImages, setProjectImages] = useState<string[]>([]);

  const selectedSchema: CmsContentSchema | undefined = useMemo(
    () => getCmsSchemaBySlug(selectedSlug),
    [selectedSlug],
  );

  useEffect(() => {
    if (!contentApiBaseUrl || !selectedSchema) {
      return;
    }

    const controller = new AbortController();

    async function loadContent() {
      setIsLoading(true);
      setStatusMessage("");
      try {
        const response = await fetch(`${contentApiBaseUrl}/public/content/${selectedSchema.slug}`, {
          signal: controller.signal,
          cache: "no-store",
        });

        if (!response.ok) {
          setTitle(selectedSchema.title);
          setContentData(selectedSchema.defaultValue as Record<string, JsonLike>);
          setStatusMessage("Контент не найден в БД, загружен шаблон по умолчанию.");
          return;
        }

        const payload = (await response.json()) as ContentApiResponse;
        setTitle(payload.title ?? selectedSchema.title);
        setContentData((payload.data ?? selectedSchema.defaultValue) as Record<string, JsonLike>);
      } catch {
        setTitle(selectedSchema.title);
        setContentData(selectedSchema.defaultValue as Record<string, JsonLike>);
        setStatusMessage("Не удалось загрузить контент из API. Проверьте backend.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadContent();
    return () => controller.abort();
  }, [selectedSchema]);

  useEffect(() => {
    if (!contentApiBaseUrl || !apiKey.trim()) {
      return;
    }

    const controller = new AbortController();

    async function loadImageLibrary() {
      try {
        const response = await fetch(`${contentApiBaseUrl}/admin/media/library`, {
          method: "GET",
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
      setStatusMessage("Сохранено успешно.");
    } catch {
      setStatusMessage("Сетевая ошибка при сохранении. Проверьте backend/API URL.");
    } finally {
      setIsSaving(false);
    }
  }

  function setValueByPath(path: JsonPath, value: JsonLike) {
    function update(current: JsonLike, currentPath: JsonPath): JsonLike {
      if (currentPath.length === 0) {
        return value;
      }

      const [head, ...tail] = currentPath;
      if (typeof head === "number") {
        const sourceArray = Array.isArray(current) ? [...current] : [];
        sourceArray[head] = update((sourceArray[head] ?? null) as JsonLike, tail);
        return sourceArray;
      }

      const sourceObject =
        current && typeof current === "object" && !Array.isArray(current)
          ? { ...(current as Record<string, JsonLike>) }
          : {};
      sourceObject[head] = update((sourceObject[head] ?? null) as JsonLike, tail);
      return sourceObject;
    }

    setContentData((current) => update(current as JsonLike, path) as Record<string, JsonLike>);
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

  function renderEditor(value: JsonLike, path: JsonPath, label: string): ReactNode {
    if (typeof value === "string") {
      const isLong = value.length > 80 || value.includes("\n");
      const isImage = isImageField(label, value);
      return (
        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium text-slate-600">{label}</span>
          {isImage ? (
            <div className="mb-2 overflow-hidden rounded-lg border border-slate-200 bg-slate-50 p-2">
              {value ? (
                <img
                  src={value}
                  alt={label}
                  className="h-28 w-full rounded object-cover"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div className="flex h-28 items-center justify-center rounded bg-slate-100 text-xs text-slate-500">
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
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
          <div className="mt-2 space-y-3">
            {value.map((item, index) => (
              <div key={`${label}-${index}`} className="rounded-lg border border-slate-200 bg-white p-3">
                {renderEditor(item as JsonLike, [...path, index], `${label}[${index}]`)}
              </div>
            ))}
            <button
              className="rounded-lg border border-slate-300 px-3 py-1 text-xs"
              type="button"
              onClick={() => {
                const nextItem =
                  value.length > 0
                    ? (JSON.parse(JSON.stringify(value[0])) as JsonLike)
                    : ("" as JsonLike);
                setValueByPath(path, [...value, nextItem]);
              }}
            >
              Добавить элемент
            </button>
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

  return (
    <main className="min-h-screen bg-[#f8f8f8] px-4 py-8 text-[#0f172a] sm:px-8">
      <div className="mx-auto max-w-5xl rounded-3xl bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-3xl font-semibold">Админка контента</h1>
        <p className="mt-2 text-sm text-slate-600">
          Поля редактируются визуально и сохраняются в локальную CMS-базу backend. Все подключенные
          секции обновляются на витрине сразу после сохранения и перезагрузки.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
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
            disabled={isLoading}
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
            onClick={() => {
              setStatusMessage(prettyJson(contentData));
            }}
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
      </div>
    </main>
  );
}
