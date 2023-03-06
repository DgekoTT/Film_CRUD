const db = require('../db');


class GenreController {
    async creatGenre(req, res) {
        const {genre} = req.body;
      
        const newGenre = await db.query(`INSERT INTO 
        genre (genre) values ($1) RETURNING *`, [genre]);
    
        res.json(newGenre.rows[0]);
    }

    async getAllGenre(req, res) {
        let allFilms = await db.query('SELECT * FROM film');

        res.json(allFilms.rows);
    }

    async getGenreByName(req, res) {
        let name = req.params.name;
        let FilmByName = await db.query(`SELECT * FROM film WHERE
         film_name = $1`, [name])

        res.json(FilmByName.rows[0])
    }

    async updateGenre(req, res) {
        const {film_id, film_name, productionYear} = req.body;
        console.log(req.body)
        let film = await db.query(`UPDATE film SET film_name = $2,
         production_year = $3 WHERE film_id = $1 RETURNING *`,
        [film_id, film_name, productionYear]);
        
         res.json(film.rows[0]);
    }

    async deleteGenre(req, res) {
        const name = req.params.name;
        const film = await db.query(`DELETE FROM film WHERE 
        film_name = $1`, [name]);

        res.json(film.rows[0])
    }
}

module.exports = new GenreController();