const db = require('../db');


class FilmController {
    async creatFilm(req, res) {
        // genres должен быть массивом, 
        const {film_name, production_year, genres} = req.body;
     
        let fail = checkBody (film_name, production_year, genres);

        if (fail) {
            res.json(fail);
        } else {
            const newFilm = await db.query(`INSERT INTO 
            film (film_name, production_year) 
            values ($1, $2) RETURNING *`, [film_name, production_year]);

            let newFilm_id = await findFilmID(film_name);

            console.log(newFilm_id)
            let setGenre = await writeGenre(genres, newFilm_id);

            newFilm.rows[0].genres = genres.join(', ');

            res.json(newFilm.rows[0]);
        }
    }

    async getAllFilms(req, res) {
        let allFilms = await db.query(`SELECT film_id, film_name,
        production_year, genre FROM film JOIN
        (film_genre  JOIN genre USING(genre_id)) USING (film_id)`);
        allFilms = allFilms.rows;

        let filmAllGenre = concatGenre(allFilms);
        
        res.json(filmAllGenre);
    }

    async getFilmByName(req, res) {
        let name = req.params.name;

        let filmByName = await db.query(`SELECT film_id, film_name,
        production_year, genre FROM film  JOIN
        (film_genre  JOIN genre USING(genre_id)) USING (film_id) 
        WHERE film_name = $1`, [name]);
        filmByName = filmByName.rows;

        res.json(getFilmByNameAllGenre (filmByName, name));
    }

    async updateFilm(req, res) {
        let {film_id, film_name, production_year, genres} = req.body;

        let fail = checkBody (film_name, production_year, genres);

        if (fail ) {
            res.json(fail);
        } else {
            let worning = await checkFilmId(film_id);

            if (worning) {
                    res.json(worning);
            } else {
                let film = await db.query(`UPDATE film SET film_name = $2,
                production_year = $3 WHERE film_id = $1 RETURNING *`,
                [film_id, film_name, production_year]);
                film = film.rows[0];
        
                let oldGenreDelete = await db.query(`DELETE FROM film_genre
                WHERE film_id = $1`, [film_id]); 
        
                let setGenre = await writeGenre(genres, film_id);
        
                film.genres = genres.join(', ');
        
                res.json(film);
            }
        }
    }
 


    async deleteFilm(req, res) {
        const name = req.params.name;
        let film_id = await findFilmID(name);

        if (!film_id) {
            res.json(`Фильм ${name}  в базе не найден!`);
        } else {
            
            const genreDelete = await db.query(`DELETE FROM film_genre WHERE 
            film_id = $1`, [film_id]);

            const film = await db.query(`DELETE FROM film WHERE 
            film_name = $1`, [name]);

            res.json(film.rows);
        }
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
    }
}


async function writeGenre(genres, newFilm_id) {

    for (let value of genres) {

        let genre_id = await db.query(`SELECT genre_id FROM 
        genre WHERE genre = $1`,[value]);

        genre_id = genre_id.rows[0].genre_id;

        let megre = await db.query(`INSERT INTO film_genre (film_id ,genre_id)
        values ($1, $2) `, [newFilm_id, genre_id]);
    }
}


function  checkgenres(genres) {

    if (!Array.isArray(genres)) {
        return `Список жанров должен быть массивом!`;
    }

    for (let part of genres) {
        if (!part instanceof String) {
            return `Жанр должен быть строкой!`;
        }
    }
};


function checkBody (film_name, production_year, genres) {

    if ([film_name, production_year, genres].includes(undefined) ||
    !Number.isInteger(production_year) || !typeof film_name == "string") {

        let example = {
            "пример правильного заполнения": "!!!",
            "film_name": "пила",
            "production_year": 1998,
            "genres": ["Ужасы", "Триллер"]
        };

        return example;
    } 
    return checkgenres(genres);  
};


async function findFilmID(film_name) {
    let newFilm_id = await db.query(`SELECT film_id 
    FROM film WHERE film_name = $1`,[film_name]);

    if (!newFilm_id.rows.length) {
        return newFilm_id;
    } else {
        newFilm_id = newFilm_id.rows[0].film_id;
        return newFilm_id;
    }
};


async function checkFilmId(film_id) {
    let problem = await db.query(`SELECT * FROM film
    WHERE film_id = $1`, [film_id]);
    console.log(problem)
    if (!problem.rows.length) {
        return `Фильм в базе не найден!`;
    }
}

module.exports = new FilmController();