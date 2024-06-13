const Cliente = require('../models/Cliente')
const bcrypt = require('bcrypt')
const criarClienteToken = require('../helpers/cria-cliente-token')

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

        /* Verifica se cliente já está cadastrado */
        const clienteExiste = await Cliente.find0ne({email: email})

        if (clienteExiste){
            res.status(422).json({mensagem: "E-mail já cadastrado"})
        }

        /* Crição de senha */
        const salt = await bcrypt.genSalt(12)
        const senhaHash = await bcrypt.hash(senha,salt)

        /* Adicionando o cliente ao bd */
        const cliente = new Cliente({nome, email, telefone, senha: senhaHash})

        try{
            const novoCliente = await cliente.save()
            await criarClienteToken(novoCliente, req, res)
        } catch(erro){
            res.status(500).json({mensagem: erro})
        }
    } /* Fim do método resgitro */
}