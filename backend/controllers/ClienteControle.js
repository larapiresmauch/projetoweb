const Cliente = require('../models/Cliente')
const bcrypt = require('bcrypt')
const criarClienteToken = require('../helpers/cria-cliente-token')

module.exports = class ClienteController {
    static async registrar(req, res) {
        const nome = req.body.nome
        const email = req.body.email
        const telefone = req.body.telefone
        const senha = req.body.senha
        const senhaconf = req.body.senhaconf

        if (!nome) {
            res.status(422).json({ mensagem: "O nome é obrigatorio" })
            return
        }
        if (!email) {
            res.status(422).json({ mensagem: "O email é obrigatoria" })
            return
        }
        if (!telefone) {
            res.status(422).json({ mensagem: "O telefone é obrigatoria" })
            return
        }
        if (!senha) {
            res.status(422).json({ mensagem: "O senha é obrigatoria" })
            return
        }
        if (!senhaconf) {
            res.status(422).json({ mensagem: "Confirme a senha" })
            return
        }

        /* Verifica se cliente já está cadastrado */
        const clienteExiste = await Cliente.find0ne({ email: email })

        if (clienteExiste) {
            res.status(422).json({ mensagem: "E-mail já cadastrado" })
        }

        /* Crição de senha */
        const salt = await bcrypt.genSalt(12)
        const senhaHash = await bcrypt.hash(senha, salt)

        /* Adicionando o cliente ao bd */
        const cliente = new Cliente({ nome, email, telefone, senha: senhaHash })

        try {
            const novoCliente = await cliente.save()
            await criarClienteToken(novoCliente, req, res)
        } catch (erro) {
            res.status(500).json({ mensagem: erro })
        }
    } /* Fim do método resgitro */

    /*  metedo login */
    static async login(req, res) {
        const { email, senha } = req.body
        if (!email) {
            res.status(422).json({
                mensagem: "O e-mail é obrigatório"
            })
            return
        }

        if (!senha) {
            res.status(422).json({
                mensagem: "O senha é obrigatório"
            })
            return
        }

        const cliente = await Cliente.find0ne({ email: email })

        if (!cliente) {
            res.status(422).json({
                mensagem: "Usuário não encontrado!"
            })
            return
        }
        // Verifica se senha confere com senha registrada 
        const verificaSenha =
            await bcrypt.compare(senha, cliente.senha)
        if (!verificaSenha) {
            res.status(422).json({ mensagem: "Senha não confere" })
        }
        await createUserToken(cliente, req, res)
    } /* fim do login */

    //NOVO CODIGO A PARTIR DE 01/08/2024
    //Metodo (funçao) PARA VERIFICAR USUARIO
    //Metodos estaticos nao precisam ter sua 
    //chmada definida em uma instancia da classe
    static async verificaUsuario(req, res){
        let usuarioAtual 

        console.log(req.headers.autorizacao)

        if (req.headers.autorizacao){
            const token = getToken(req)
            const decodificado = jwt.verify(token,'mysecret')
            usuarioAtual = await Cliente.findBvTd(decodificado)
            usuarioAtual.senha = undefined
            //segurança aqui: esvazia o retorno da senha 
        } else{
            usuarioAtual = null
        }

        res.status(200).send(usuarioAtual)

    }

} //fim da classe CliebteControle