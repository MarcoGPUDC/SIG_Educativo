// -----------------------
// INSERT DINÁMICO
// -----------------------
function buildInsertQuery(table, fieldsObj, pgp) {
    const keys = Object.keys(fieldsObj);
    const values = Object.values(fieldsObj);

    const columns = keys.map(k => pgp.as.name(k)).join(', ');
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');

    const query = `
        INSERT INTO ${pgp.as.name(table)} (${columns})
        VALUES (${placeholders})
        RETURNING *;
    `;

    return { query, values };
}


// -----------------------
// UPDATE DINÁMICO
// -----------------------
function buildUpdateQuery(table, idField, idValue, fieldsObj, pgp) {
    const keys = Object.keys(fieldsObj);
    const values = Object.values(fieldsObj);

    const setters = keys
        .map((k, i) => `${pgp.as.name(k)} = $${i + 1}`)
        .join(', ');

    // agregamos el id al final
    values.push(idValue);

    const query = `
        UPDATE ${pgp.as.name(table)}
        SET ${setters}
        WHERE ${pgp.as.name(idField)} = $${values.length}
        RETURNING *;
    `;

    return { query, values };
}


// -----------------------
// DELETE BÁSICO (opcional)
// -----------------------
function buildDeleteQuery(table, idField, idValue, pgp) {
    const query = `
        DELETE FROM ${pgp.as.name(table)}
        WHERE ${pgp.as.name(idField)} = $1
        RETURNING *;
    `;
    return { query, values: [idValue] };
}


// Exportamos acceso unificado
module.exports = {
    buildInsertQuery,
    buildUpdateQuery,
    buildDeleteQuery
};
