const express = require('express');
const mysql = require('mysql');
const app = express();
const expressPort = 3000;

app.use(express.json());

const dataBase = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'root',
    database: 'restapi2'
});

dataBase.connect((err) => {
    if (err) {
        console.log('ERREUR DE CONNEXION À LA BASE DE DONNÉES !');
    } else {
        console.log('BRAVO, VOUS ÊTES CONNECTÉ À LA BASE DE DONNÉES !');
    }
});

app.listen(expressPort, () => {
    console.log('LE SERVEUR EST LANCÉ, LA FAMILLE :', expressPort);
});

app.get('/items', (req, res) => {
    const sql = 'SELECT * FROM items;'

    dataBase.query(sql, (err, result) => {
        if (err) {
            return res.status(500); json({ error: 'ERREUR DU SERVEUR' })
        } else {
            return res.status(200).json(result);
        }
    })
})

app.post("/createitems", (req, res) => {
    const { name, price, id_category, description } = req.body;
    const sql =
        "INSERT INTO items (name, price, id_category, description) VALUES (? , ? , ? , ?)";
        dataBase.query(sql, [name, price, id_category, description], (err, result) => {
            if (err) {
                return res.status(500).json({ error: "ERREUR DU SERVEUR" });
            } else {
                return res.status(200).json(result);
            }
        }
    );
});

app.put("/updateitems/:id", (req, res) => {
    const { name, price, id_category, description } = req.body;
    const { id } = req.params;

    const sql = "UPDATE items SET name = ?, price = ?, id_category = ?, description = ? WHERE id = ?";
    dataBase.query(sql, [name, price, id_category, description, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "ERREUR DU SERVEUR" });
        } else {
            return res.status(200).json({ message: "Item mis à jour avec succès", id });
        }
    });
})


app.delete("/deleteItems/:id", (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM items WHERE id = ?"; // Correction du nom de la table

    dataBase.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "ERREUR DU SERVEUR" });
        } else if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Item non trouvé" });
        } else {
            return res.status(200).json({ message: "Item supprimé avec succès", id });
        }
    });
});


app.get("/getItem2", (req, res) => {
    const sql = `
      SELECT items.id AS item_id, items.name AS item_name, categories.id AS category_id, categories.name AS category_name
      FROM items
      INNER JOIN items_categories ON items.id = items_categories.id_item
      INNER JOIN categories ON items_categories.id_categorie = categories.id;
    `;
    dataBase.query(sql, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "ERREUR DU SERVEUR" });
      } else {
        return res.status(200).json(result);
      }
    });
  });
  
  