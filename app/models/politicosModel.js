var pool = require("../../config/pool-conexoes");

const politicosModel = {
    findAll: async () => {
        try {
            const [resultados] = await pool.query(
                "SELECT * from Politicos"
            );
            return resultados;
        } catch (error) {
            console.log(error);
            return error;  
        }
    },

    findCampoCustom: async (dados, coluna) => {
        try {
            const [resultados] = await pool.query(
                `SELECT * FROM Politicos WHERE ${coluna} = ?`,
                [dados]
            );
            return resultados;
        } catch (error) {
            console.log(error);
            return error;
        }
    },

    findId: async (id) => {
        try {
            const [resultados] = await pool.query(
                "SELECT * from Politicos WHERE idPoliticos = ?", [id]
            );
            return resultados;
        } catch (error) {
            console.log(error);
            return error;
        }
    },

    create: async (camposForm) => {
        try {
            const [resultados] = await pool.query(
                "INSERT INTO Politicos SET ?", [camposForm]
            );
            return resultados;
        } catch (error) {
            console.log(error);
            return null;
        }
    },

    delete: async (id) => {
        try {
            const [resultados] = await pool.query(
                "DELETE Politicos WHERE idPoliticos = ? ", [id]
            );
            return resultados;
        } catch (error) {
            console.log(error);
            return error;
        }
    },
};

module.exports = politicosModel;