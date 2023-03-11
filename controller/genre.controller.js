const { query } = require('express');
const db = require('../db');


class GenreController {
    async creatGenre(req, res) {
        const {genre} = req.body;
        
        let fail = checkNameforString(genre);
        if (fail) {
            res.json(fail);
        } else {
            const newGenre = await db.query(`INSERT INTO 
            genre (genre) values ($1) RETURNING *`, [genre]);
        
            res.json(newGenre.rows[0]);
        }

    }

    async getAllGenre(req, res) {
        let AllGenre = await db.query('SELECT * FROM genre');

        res.json(AllGenre.rows);
    }

    async getGenreByName(req, res) {
        let name = req.params.name;
       
        let fail = checkNameforString(name);
        if (fail) {
            res.json(fail);
        } else {
            let genreByName = await findGenre(name);

            res.json(genreByName);
        }
    }

    async updateGenre(req, res) {
        const {genre_id, genre} = req.body;
       
        let fail = checkNameforString(genre);
        if (fail) {
            res.json(fail);
        } else {
            let checkId = await fingIdGenre(genre_id);

            if (checkId) {
               res.json(checkId);
            } else {
                let genreNew = await db.query(`UPDATE genre SET genre = $2,
                WHERE genre_id = $1 RETURNING *`,
                [genre_id, genre]);
                    
                res.json(genreNew.rows[0]);
    
                res.json(worning);
            }
        }
    }

    async deleteGenre(req, res) {
        const genre = req.params.name;

        let fail = checkNameforString(genre);
        if (fail) {
            res.json(fail);
        } else {
            let worning = await findGenre(genre);

            if (typeof worning == "string") {
                res.json(worning);
            } else {
                const genreDel = await db.query(`DELETE FROM genre WHERE 
                genre = $1`, [genre]);
    
                res.json(genreDel.rows[0])
            }
        }
    }
}


function checkNameforString(genre) {
    if (typeof genre != 'string') {
        return `Имя сценария должно быть строкой!`;
    } 
};


async function findGenre(name) {
    let genreData = await db.query(`SELECT * FROM genre WHERE
    genre = $1`, [name]);
 
    if (genreData.rows.length) {
        return genreData.rows[0];
    }

    return `Сценарий ${name} не найден в базе`;
}


async function fingIdGenre(genre_id) {
    if (!Number.isInteger(genre_id)) {
        return `Id должен быть числом`;
    } else {
        let worning = await db.query(`SELECT * FROM genre
        WHERE genre_id = $1`, [genre_id]);

        if (worning.rows.length == 0) {
            return `Сценарий с Id ${genre_id} не найден в базе!`;
        } else {
            return false;
        }
    }
}

module.exports = new GenreController();

