import Knex from "knex";

export async function seed(knex: Knex) {
    await knex('items').insert([
        { title: 'Baterias', image: 'baterias.svg' },
        { title: 'Eletrônicos', image: 'eletronicos.svg' },
        { title: 'Lâmpadas', image: 'lampadas.svg' },
        { title: 'Óleo', image: 'oleo.svg' },
        { title: 'Orgânicos', image: 'organicos.svg' },
        { title: 'Papéis e Papelão', image: 'papeis-papelao.svg' }
    ])
}