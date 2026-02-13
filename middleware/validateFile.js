export function validateFile(req, res, next) {
    const { file } = req;
    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    const maxSize = 5 * 1024 * 1024;
    const errors = [];

    if (!file) {
        errors.push({msg: "Файл не додано"});
    } else {
        if (!allowedTypes.includes(file.mimetype)) {
            errors.push({msg: "Type of file is not supported. Supported types: jpeg, png, docs, pdf"});
        }
        if (file.size > maxSize) {
            errors.push({msg: "Size of file to big (max 5MB)"});
        }
    }
    if (errors.length) {
        return res.status(400).render("fileUpload", { errors, folderId: req.params.folderId });
    }

    next();
}
