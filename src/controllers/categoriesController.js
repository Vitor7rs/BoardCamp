import db from "../config/db.js"

export async function getCategories(req, res){
    try{
        const categories = await db.query("SELECT * FROM categories");
        return res.status(200).send(categories.rows);
    }catch(error){
        console.log(error);
        return res.sendStatus(500);
    }
}

export async function insertCategory(req, res){
    const category = req.body;
    try{
        const result = await db.query('SELECT id FROM categories WHERE name=$1', [category.name]);
        if(result.rowCount > 0) {
            return res.sendStatus(409)
        }
        await db.query(`INSERT INTO categories(name) VALUES ($1)`, [category.name]);
        res.sendStatus(201)
    }catch(error){
        console.log(error);
        res.sendStatus(500);
    }
}