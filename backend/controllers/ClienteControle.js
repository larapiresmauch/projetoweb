const Cliente = require('../models/Cliente')
const bcrypt = require('bcrypt')

module.exports = class ClienteController{
    static async registrar(req, res){
        const nome = req.body.nome
        const email = req.body.email
        const telefone = req.body.telefone
        const senha = req.body.senha
        const senhaconf = req.body.senhaconf

        if(!nome){
            res.status(422).json({mensagem: "O nome é obrigatorio"})
            return
        }
        if(!email){
            res.status(422).json({mensagem: "O email é obrigatoria"})
            return
        }
        if(!telefone){
            res.status(422).json({mensagem: "O telefone é obrigatoria"})
            return
        }
        if(!senha){
            res.status(422).json({mensagem: "O senha é obrigatoria"})
            return
        }
        if(!senhaconf){
            res.status(422).json({mensagem: "Confirme a senha"})
            return
        }
    }
}