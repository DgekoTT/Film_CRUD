const db = require('../db');


class GenreController {
    async creatGenre(req, res) {
        const {genre} = req.body;
      
        const newGenre = await db.query(`INSERT INTO 
        genre (genre) values ($1) RETURNING *`, [genre]);
    
        res.json(newGenre.rows[0]);
    }

    async getAllGenre(req, res) {
        let AllGenre = await db.query('SELECT * FROM genre');

        res.json(AllGenre.rows);
    }

    async getGenreByName(req, res) {
        let name = req.params.name;
        let GenreByName = await db.query(`SELECT * FROM genre WHERE
         genre = $1`, [name])

        res.json(GenreByName.rows[0])
    }

    async updateGenre(req, res) {
        const {genre_id, genre} = req.body;
        console.log(req.body)
        let genreNew = await db.query(`UPDATE genre SET genre = $2,
        WHERE genre_id = $1 RETURNING *`,
        [genre_id, genre]);
        
         res.json(genreNew.rows[0]);
    }

    async deleteGenre(req, res) {
        const genre = req.params.name;
        console.log(genre)
        const genreDel = await db.query(`DELETE FROM genre WHERE 
        genre = $1`, [genre]);

        res.json(genreDel.rows[0])
    }
}

module.exports = new GenreController();