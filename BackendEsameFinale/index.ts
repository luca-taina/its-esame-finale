import fastify from 'fastify'
import * as swagger from 'fastify-swagger'

const port = 3000;
const app = fastify({logger:true, ignoreTrailingSlash: true})

app.register(swagger.default, {
    routePrefix: '/api/documentation',
    swagger: {
      info: {
        title: 'Documentazione API',
        description: 'Documentazione API Esame Finale',
        version: '1.0.0'
      },
      host: 'localhost:3000',
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json'],
      tags: [{
        name: 'default',
        description: ''
      }]
    },
    exposeRoute: true
  })


var attrazioni = [
  {
    "idAttrazione": 0,
    "nome": "Colosseo",
    "descrizioneCorta": "Descrizione del colosseo",
    "descrizioneCompleta": "Descrizione completa del colosseo, storia opere ecc.",
    "localita": "Roma",
    "tipoInteresse": "Storico, Paesaggistico",
    "immagine": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Colosseo_2020.jpg/1200px-Colosseo_2020.jpg",
    "contapersone": {
        "mattina": {
          "uscite": 2,
          "entrate": 3,
        },
        "pomeriggio": {
          "uscite": 4,
          "entrate": 16,
        },
    }
  },
  {
    "idAttrazione": 1,
    "nome": "Piazza San Marco",
    "descrizioneCorta": "Descrizione della Piazza di San Marco",
    "descrizioneCompleta": "Descrizione completa della Piazza di San Marco , perchè è la più bella di Venezia",
    "localita": "Venezia",
    "tipoInteresse": "Storico, Paesaggistico",
    "immagine": "https://cdn.marcopolo.tv/960x480/media/post/5lplbv5/piazza-san-marco2.jpg"
  },
  {
    "idAttrazione": 2,
    "nome": "Galleria degli Uffizi",
    "descrizioneCorta": "Descrizione della galleria",
    "descrizioneCompleta": "Descrizione completa della galleria, perchè è la più bella di Firenze",
    "localita": "Firenze",
    "tipoInteresse": "Artistico, Storico",
    "immagine": "https://images.uffizi.it/production/attachments/1568618095066237-Madonna-della-Cesta-2-piccolo.jpg?ixlib=rails-2.1.3&w=700&h=fill&fit=unset&crop=center&fm=gjpg&auto=compress"
  }
]


app.get('/',{
    schema: {
      description: "Richiedi lista di tutte le attrazioni",
      response: {
        200: {
          description: 'Successful response',
          type: 'object',
          properties: {
            result: { type: 'boolean' },
            message: { type: 'string'},
            attrazioni: { type: 'array',
                items: { 
                    type: 'object',
                    properties: {
                        idAttrazione: { type: 'number'},
                        nome: { type: 'string'},
                        descrizioneCorta: { type: 'string'},
                        descrizioneCompleta: { type: 'string'},
                        localita: { type: 'string'},
                        tipoInteresse: { type: 'string'},
                        immagine: { type: 'string'},
                    }
                },
            minItems: 1,
          collectionFormat: 'multi'}
          }
        }
      }
    }
  }, (req, reply) => {
    reply.send({result:true, message:"La lista delle attrazioni", attrazioni:attrazioni})
})

app.get('/:idAttrazione',{
    schema: {
      description: "Get by ID",
      params: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Get by ID attrazioni'
          }
        }
      },
      response: {
        200: {
          description: 'Successful response',
          type: 'object',
          properties: {
            result: { type: 'boolean' },
            message: { type: 'string'},
            attrazioni: { 
                    type: 'object',
                    properties: {
                      idAttrazione: { type: 'number'},
                      nome: { type: 'string'},
                      descrizioneCorta: { type: 'string'},
                      descrizioneCompleta: { type: 'string'},
                      localita: { type: 'string'},
                      tipoInteresse: { type: 'string'},
                      immagine: { type: 'string'},
                    }
            }
          }
        }
      }
    }
  }, (req:any, reply) => {
    let id = req.params.id;

    let i = (element) => element.id == id;

    if (!attrazioni[attrazioni.findIndex(i)]){

        reply.send({result:false, message: "L'attrazione non c'è"})
        return
    }
    
    reply.send({result: true, message: "Qui l'attrazione richiesta", attrazioni: attrazioni[attrazioni.findIndex(i)]})
})

app.post('/',{
    schema: {
      description: "Aggiungi nuova attrazione",
      body: {
        type: 'object',
        properties: {
          idAttrazione: { type: 'number'},
          nome: { type: 'string'},
          descrizioneCorta: { type: 'string'},
          descrizioneCompleta: { type: 'string'},
          localita: { type: 'string'},
          tipoInteresse: { type: 'string'},
          immagine: { type: 'string'},
        }
      },
      response: {
        200: {
          description: 'Successful response',
          type: 'object',
          properties: {
            result: { type: 'boolean' },
            message: { type: 'string'}
          }
        }
      }
    }
  }, (req:any, reply) => {
    let data:any = req.body;

    data.id = attrazioni.length

    attrazioni.push(data);

    reply.send({result: true, message: "Aggiunta l'attrazione", attrazioni: data})
})

app.put('/:idAttrazione',{
    schema: {
      description: "Modifica attrazione",
      params: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Get by ID attrazione'
          }
        }
      },
      body: {
        type: 'object',
        properties: {
          idAttrazione: { type: 'number'},
          nome: { type: 'string'},
          descrizioneCorta: { type: 'string'},
          descrizioneCompleta: { type: 'string'},
          localita: { type: 'string'},
          tipoInteresse: { type: 'string'},
          immagine: { type: 'string'},
        }
      },
      response: {
        200: {
          description: 'Successful response',
          type: 'object',
          properties: {
            result: { type: 'boolean' },
            message: { type: 'string'}
          }
        }
      }
    }
  }, (req:any, reply) => {
    let id = req.params.id;
    let data = req.body;

    
    let i = (element) => element.id == id;
    let oldData = attrazioni[attrazioni.findIndex(i)];

    if (!attrazioni[attrazioni.findIndex(i)]){

        reply.send({result:false, message: "Attrazione non trovata"})
        return
    }

    data.id = oldData.idAttrazione;

    attrazioni[attrazioni.findIndex(i)] = data;

    reply.send({result:true, message: "Dati dell'attrazione cambiati con successo"})
})

app.delete('/:idAttrazione',{
    schema: {
      description: "Elimina attrazione",
      params: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Get by ID attrazione'
          }
        }
      },
      response: {
        200: {
          description: 'Successful response',
          type: 'object',
          properties: {
            result: { type: 'boolean' },
            message: { type: 'string'}
          }
        }
      }
    }
  }, (req:any, reply) => {
    let id = req.params.id;
    
    let i = (element) => element.id == id;

    if (!attrazioni[attrazioni.findIndex(i)]){
        reply.send({result:false, message: "L'attrazione non esiste"})
        return
    }

    attrazioni.splice(attrazioni.findIndex(i), 1)

    reply.send({result: true, message: "Attrazione eliminata"})
})


app.listen(port)