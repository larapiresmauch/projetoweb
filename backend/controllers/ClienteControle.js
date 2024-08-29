const Produto = require('../models/Produto')


module.exports = class ProdutoController {
    static async cadastrar(req, res) {
        const sku = req.body.sku
        const marca = req.body.marca
        const descricao = req.body.descricao
        const preco = req.body.preco
        const dataFabricacao = req.body.dataFabricacao
        
        if (!sku) {
            res.status(422).json({ mensagem: "O código sku é obrigatorio"})
            return
        }
        if (!marca) {
            res.status(422).json({ mensagem: "A marca é obrigatoria"})
            return
        }
        if (!descricao) {
            res.status(422).json({ mensagem: "A descrição é obrigatoria"})
            return
        }
        if (!preco) {
            res.status(422).json({ mensagem: "O preço é obrigatoria"})
            return
        }
        if (!dataFabricacao) {
            res.status(422).json({ mensagem: "A data de fabricação é obrigatoria"})
            return
        }

        /* Verifica existencia de produto */
        const produtoExiste = await Produto.find0ne({ sku: sku })

        if (produtoExiste) {
            res.status(422).json({ mensagem: "Produto já cadastrado" })
        }

        /* cadastro de produtos*/
        const produto = new Produto({sku,marca,descricao,preco,dataFabricacao})

        try {
            const novoProduto= await produto.save()
        } catch (erro) {
            res.status(500).json({ mensagem: erro })
        }
    } /* Fim do método cadastrar*/

} //fim da classe CliebteControle