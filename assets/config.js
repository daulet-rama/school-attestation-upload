/* Настройки сайта загрузки документов. */
window.SITE_CONFIG = {
    mode: "upload",
    github: {
        owner: "daulet-rama",
        repo: "school-attestation-upload",
        branch: "uploads"
    },
    // GitHub API принимает файлы примерно до 30 МБ; большие файлы прикрепляются ссылкой (Google Диск).
    maxUploadMB: 30
};
