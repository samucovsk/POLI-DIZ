var pool = require("../../config/pool-conexoes");

const usuarioModel = {
    findAll: async () => {
        try {
            const [resultados] = await pool.query(
                "SELECT u.id_usuario, u.nome_usuario, u.user_usuario, " +
                "u.senha_usuario, u.email_usuario, u.fone_usuario, u.tipo_usuario, " +
                "u.status_usuario, t.tipo_usuario, t.descricao_usuario " +
                "FROM usuario u, tipo_usuario t where u.status_usuario = 1 and " +
                "u.tipo_usuario = t.id_tipo_usuario"
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
                `SELECT * FROM Usuario WHERE ${coluna} = ?`,
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
                "SELECT * FROM Usuario WHERE idUsuario = ?", [id]
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
                "insert into Usuario set ?", [camposForm]
            );
            return resultados;
        } catch (error) {
            console.log(error);
            return null;
        }
    },

    update: async (camposForm, id) => {
        try {
            const [resultados] = await pool.query(
                "UPDATE Usuario SET nomeUsuario = ?, enderecoUsuario = ?, descUsuario = ?, CPFUsuario = ?, cepUsuario = ?, TelefoneUsuario = ?  WHERE idUsuario = ?",
                [camposForm.nome, camposForm.estado, camposForm.desc_usuario, camposForm.cpf, camposForm.cep, camposForm.telefone, id]
            );
            console.log(resultados);
            return resultados;
        } catch (error) {
            console.log(error);
            return error;
        }
    },

    updateImg: async (tipo_foto, campoImg, id) => {
        try {
            const [resultados] = await pool.query(
                `UPDATE Usuario SET ${tipo_foto} = ? where idUsuario = ?`, [campoImg, id]
            );
            
            console.log(resultados);
            return resultados;
        } catch (error) {
            console.log(error);
            return error;
        }
    },

    delete: async (id) => {
        try {
            const [resultados] = await pool.query(
                "UPDATE Usuario SET status_usuario = 0 WHERE id_usuario = ? ", [id]
            );
            return resultados;
        } catch (error) {
            console.log(error);
            return error;
        }
    },
};

module.exports = usuarioModel;