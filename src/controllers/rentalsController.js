import db from "../config/db.js";

export async function getRentals(req, res) {
    const { customerId, gameId } = req.query;

    try {
        let whereFilter = '';
        const params = [];
        const filters = [];

        if (customerId) {
            params.push(customerId);
            filters.push(`rentals."customerId" = $${params.length}`);
        }
        if (gameId) {
            params.push(gameId);
            filters.push(`rentals."gameId"=$${params.length}`);
        }
        if (params.length > 0) {
            whereFilter += `WHERE ${filters.join(" AND ")}`;
        }

        const result = await db.query(`SELECT rentals.*, customers.name AS customer, games.name, categories.*
            FROM rentals
            JOIN customers ON customers.id=rentals."customerId"
            JOIN games ON games.id=rentals."gameId"
            JOIN categories ON categories.id=games."categoryId"
            ${whereFilter}`,
            params);

        return res.send(result.rows);

    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

export async function insertRent(req, res) {
    const rental = req.body;
    try {
        const customersResult = await db.query(`SELECT id FROM customers WHERE id = $1`, [rental.customerId]);
        if(customersResult.rowCount === 0){
            return res.sendStatus(400);
        }
        const existingGames = await db.query(`SELECT * FROM games WHERE id=$1`, [rental.gameId]);
        if (existingGames.rowCount === 0) {
            return res.sendStatus(400); 
        }
        const game = existingGames.rows[0];
        const result = await db.query(`SELECT id FROM rentals WHERE "gameId" = $1 AND "returnDate" IS null`, [rental.gameId]);

        if (result.rowCount > 0) {
            if (game.stockTotal === result.rowCount) {
                return res.sendStatus(400);
            }
        }
        const originalPrice = rental.daysRented * game.pricePerDay;
        await db.query(`INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
        VALUES ($1, $2, NOW(), $3, null, $4, null); `, 
        [rental.customerId, rental.gameId, rental.daysRented, originalPrice]);

        return res.sendStatus(201);

    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

export async function endRent(req, res) {
    const { id } = req.params;
    try{
        const result = await db.query(`SELECT * FROM rentals WHERE id = $1`, [id]);
        if (result.rowCount === 0) return res.sendStatus(404);

        const rental = result.rows[0];
        if(rental.returnDate) return res.sendStatus(400);
        else{
            const diff = new Date().getTime() - new Date(rental.rentDate).getTime();
            const totalDays = Math.floor(diff / (24 * 3600 * 1000));

            let delayFee = 0;
            if (totalDays > rental.daysRented) {
                const lateDays = totalDays - rental.daysRented;
                delayFee = lateDays * rental.originalPrice;
            };
            await db.query(`UPDATE rentals SET "returnDate" = NOW(), "delayFee" = $1 WHERE id = $2 `, [delayFee, id]);

            return res.sendStatus(200);
        }
    }catch(error){
        console.log(error);
        return res.sendStatus(500);
    }
}

export async function deleteRental(req, res) {
    const { id } = req.params;
    try{
        const result = await db.query(`SELECT * FROM rentals WHERE id = $1`, [id]);
        if (result.rowCount === 0) {
            return res.sendStatus(404); 
        } else {
            const rental = result.rows[0];
            if (!rental.returnDate) res.sendStatus(400);
            else {
                await db.query(`DELETE FROM rentals WHERE id = $1`, [id]);
            }
        }
    }catch(error){
        console.log(error);
        return res.sendStatus(500);
    }
}
