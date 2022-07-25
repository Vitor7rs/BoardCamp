import db from "../config/db.js";

export async function getCustomers(req, res) {
    const { cpf } = req.query;

    try{
        const params = [];
        let cpfFilter = '';

        if(cpf){
            params.push(`${cpf}%`);
            cpfFilter += `WHERE cpf ILIKE $${params.length}`;
        }

        const customers = await db.query(`SELECT * FROM customers ${cpfFilter}`, params);
        return res.status(200).send(customers.rows);

    }catch(error){
        console.log(error);
        return res.sendStatus(500);
    }
}

export async function getCustomer(req, res) {
    const { id } = req.params;

    if(isNaN(parseInt(id))){
        return res.sendStatus(400);
    }

    try{
        const result = await db.query(`SELECT * FROM customers WHERE id = $1`, [id]);
        if(result.rowCount === 0) {
            return res.status(404).send("Customer id not found"); 
        }
        return res.send(result.rows[0]);

    }catch(error){
        console.log(error);
        return res.sendStatus(500);
    }
}

export async function insertCustomer(req, res) {
    const customer = req.body;
    try{
        const existingCustomer = await db.query('SELECT * FROM customers WHERE cpf = $1', [customer.cpf]);
        if(existingCustomer.rowCount > 0){
            return res.sendStatus(409);
        }

        await db.query(`INSERT INTO customers (name, phone, cpf, birthday) 
            VALUES ($1, $2, $3, $4);`, 
            [customer.name, customer.phone, customer.cpf, customer.birthday]);

        return res.sendStatus(201);

    }catch(error){
        console.log(error);
        return res.sendStatus(500);
    }
}

export async function updateCustomer(req, res) {
    const customer = req.body;
    const { id } = req.params;

    if(isNaN(parseInt(id))){
        return res.sendStatus(400);
    }

    try{
        const existingCpf = await db.query(`SELECT * FROM customers 
            WHERE customers.cpf = $1 AND customers.id != $2`, [customer.cpf, id]); //search conflict
        if(existingCpf.rowCount > 0){
            return res.sendStatus(409); 
        }
        await db.query(`UPDATE customers SET name = $1, phone = $2, cpf = $3, birthday = $4 WHERE id = $5`, 
        [customer.name, customer.phone, customer.cpf, customer.birthday, id]);

        return res.sendStatus(200);

    }catch(error){
        console.log(error);
        return res.sendStatus(500);
    }
}