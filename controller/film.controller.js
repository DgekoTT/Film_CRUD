const db = require('../db');


class FilmController {
    async creatFilm(req, res) {
        const {film_name, production_year, genre} = req.body;

        const newFilm = await db.query(`INSERT INTO 
        film (film_name, production_year) 
        values ($1, $2) RETURNING *`, [film_name, production_year]);

        let newFilm_id = await db.query(`SELECT film_id 
        FROM film WHERE film_name = $1`,[film_name]);
        newFilm_id = newFilm_id.rows[0].film_id;

        for (let value of genre) {
            let genre_id = await db.query(`SELECT genre_id FROM 
            genre WHERE genre = $1`,[value]);
            genre_id = genre_id.rows[0].genre_id;
            console.log(genre_id);

            let megre = await db.query(`INSERT INTO film_genre (film_id ,genre_id)
            values ($1, $2) RETURNING *`, [newFilm_id, genre_id]);
        };

        res.json(newFilm.rows[0]);
    }

    async getAllFilms(req, res) {
        let allFilms = await db.query(`SELECT * FROM film  JOIN
         (film_genre  JOIN genre USING(genre_id)) USING (film_id)`);
        allFilms = allFilms.rows;

        let filmAllGenre = concatGenre(allFilms);
        
        res.json(filmAllGenre);
    }

    async getFilmByName(req, res) {
        let name = req.params.name;
        let filmByName = await db.query(`SELECT * FROM film  JOIN
        (film_genre  JOIN genre USING(genre_id)) USING (film_id) 
        WHERE film_name = $1`, [name]);
        filmByName = filmByName.rows;

        res.json(getFilmByNameAllGenre (filmByName, name));
    }

    async updateFilm(req, res) {
        const {film_id, film_name, productionYear} = req.body;
        console.log(req.body)
        let film = await db.query(`UPDATE film SET film_name = $2,
         production_year = $3 WHERE film_id = $1 RETURNING *`,
        [film_id, film_name, productionYear]);
        
         res.json(film.rows[0]);
    }

    async deleteFilm(req, res) {
        const name = req.params.name;
        const film = await db.query(`DELETE FROM film WHERE 
        film_name = $1`, [name]);

        res.json(film.rows[0])
    }
}


function concatGenre (allFilms) {
    let result = allFilms.reduce((acc, el) =>{
        const i = acc.findIndex(m => m.film_id === el.film_id);
        if (!~i) {
            acc.push(el);
            if (~i) {
                acc.splice(i, 1);
            }
        }
        if (acc[i] != undefined) {
            acc[i].genre = acc[i].genre + ', ' + el.genre
        }
        return acc;
    }, []);

    return result;
}


function getFilmByNameAllGenre (filmByName, name) {
    if (filmByName[0] == undefined) {
        return `Фильм ${name} не найден !`;
    } else {
        let genres = '';

        for (let part of filmByName) {
            if (genres.length < 1) {
                genres += part.genre;
            } else {
                genres = genres + ', ' + part.genre;
            }
        }
        
        filmByName[0].genre = genres;

        return filmByName[0];
    };
};


module.exports = new FilmController();