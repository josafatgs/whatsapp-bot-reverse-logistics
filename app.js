const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MySQLAdapter = require('@bot-whatsapp/database/mysql')

/**
 * Declaramos las conexiones de MySQL
 */
const MYSQL_DB_HOST = 'localhost'
const MYSQL_DB_USER = 'root'
const MYSQL_DB_PASSWORD = ''
const MYSQL_DB_NAME = 'bot'
const MYSQL_DB_PORT = '3306'

/**
 * Aqui declaramos los flujos hijos, los flujos se declaran de atras para adelante, es decir que si tienes un flujo de este tipo:
 *
 *          Menu Principal
 *           - SubMenu 1
 *             - Submenu 1.1
 *           - Submenu 2
 *             - Submenu 2.1
 *
 * Primero declaras los submenus 1.1 y 2.1, luego el 1 y 2 y al final el principal.
 */


/**
 *  El flujo del bot es el siguiente:
 * 
 *          Solicitud de devolucion:
 *              - Motivo de devolucion
 *                  - Daño de paqueteria
 *                  - Producto roto de origen
 *                  - Producto incorrecto
 *                  - Paquete incompleto
 *                  - Producto defectuoso de fabrica
 *              - Fecha en que se recibio el producto
 *              - Motivo de devolucion(Explicación)
 *              - Imagenes, videos del producto, paquete
 *              - Numero del pedido
 *              - Numero de Ticket
 *              - Numero del cliente
 *              - Productos a devolver
 *                  - SKU
 *                  - Cantidad
 * 
 * */


const flowMotivoDevolucion = addKeyword(['Iniciar devolucion', 'Inciar devolución', 'iniciar devolucion', 'iniciar devolución'])
    .addAnswer(
        [
            '👉 Por favor, selecciona el motivo de tu devolución de la siguiente lista',
            '1. Daño de paqueteria',
            '2. Producto roto de origen',
            '3. Producto incorrecto',
            '4. Paquete incompleto',
            '5. Producto defectuoso de fabrica',
        ],
    )
    .addAnswer('¿Cual es el motivo?', { capture: true})
    .addAnswer('👉 Por favor, ingresa la fecha en que se recibio el producto', { capture: true })
    .addAnswer('👉 Por favor, ingresa el motivo de la devolucion (Explicacion detallada)', { capture: true })
    .addAnswer('👉 Por favor, sube imagenes, videos del producto, paquete', { capture: true })
    .addAnswer('👉 Por favor, ingresa el numero del pedido', { capture: true })
    .addAnswer('👉 Por favor, ingresa el numero del ticket', { capture: true })
    .addAnswer('👉 Por favor, ingresa el numero del cliente', { capture: true })
    .addAnswer('👉 Por favor, ingresa los productos a devolver', { capture: true })
    .addAnswer('Gracias por tu informacion, un asesor se pondra en contacto contigo en las proximas 24hr para continuar con el proceso de devolucion')


const flowPrincipal = addKeyword(['Devolucion', 'devolucion', 'Devolución', 'devolución'])
    .addAnswer('🙌 Hola, gracias por contactarte, iniciemos el proceso de devolucion.')
    .addAnswer(
        [
            'A continuacion te muestro los pasos a seguir para realizar la devolucion:',
            '👉 Llenas la solicitud de devolución',
            '👉 Un asesor la recibe, y te contacta en caso de requerir mayor información',
            '👉 En caso de que la devolucion a sucursal se apruebe, el asesor te contacta y te pide un deposito para el envio de la devolucion',
            '👉 El asesor te comparte una guia de envio para que mandes los productos a una de nuestra sucursales',
            '👉 Una vez que recibimos el producto en nuestra sucursal, daremos una resolucion a tu devolucion en las proximas 48hr',
            '👉 En caso de que la resolucion de devolucion sea aprobada, se te otorgara una nota de credito, En caso de que la resolucion de devolucion sea rechazada, se te notificara el motivo',
            'Para más informacion puedes revisar nuestra *Politica de devoluciones y garantías*: https://www.tiendanube.com/ayuda/politicas-de-devolucion-y-garantia',
        ]
    )
    .addAnswer(
         '👉 Para iniciar la devolucion, escribe *Iniciar devolucion*',
        null,
        null,
        [flowMotivoDevolucion]
    )

const main = async () => {
    const adapterDB = new MySQLAdapter({
        host: MYSQL_DB_HOST,
        user: MYSQL_DB_USER,
        database: MYSQL_DB_NAME,
        password: MYSQL_DB_PASSWORD,
        port: MYSQL_DB_PORT,
    })
    const adapterFlow = createFlow([flowPrincipal])
    const adapterProvider = createProvider(BaileysProvider)
    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })
    const BOTNAME = 'bot'
    QRPortalWeb({ name: BOTNAME, port: 3005 })
}

main()
