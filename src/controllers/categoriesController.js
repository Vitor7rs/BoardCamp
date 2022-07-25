import categoriesRepository from "../repositories/categoriesRepository.js";

export async function getCategories(req, res){
    try{
        const categories = await categoriesRepository.getAllCategories();
        return res.status(200).send(categories);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

export async function insertCategory(req, res){
    
}