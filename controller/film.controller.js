const db = require('../db');


class FilmController {
    async creatFilm(req, res) {
        const {film_name, productionYear} = req.body;
      
        const newFilm = await db.query(`INSERT INTO 
        film (film_name, production_year) 
        values ($1, $2) RETURNING *`, [film_name, productionYear]);
    
        res.json(newFilm.rows[0]);
    }

    async getAllFilms(req, res) {
        let allFilms = await db.query('SELECT * FROM film');

        res.json(allFilms.rows);
    }

    async getFilmByName(req, res) {
        let name = req.params.name;
        let FilmByName = await db.query(`SELECT * FROM film WHERE
         film_name = $1`, [name])

        res.json(FilmByName.rows[0])
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

module.exports = new FilmController();