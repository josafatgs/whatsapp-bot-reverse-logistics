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


// Flujo para capturar el motivo de devolución
const flowMotivoDevolucion = addKeyword(['Iniciar devolución'])
    .addAnswer('📦 Por favor selecciona el motivo de devolución:')
    .addAnswer(
        [
            '1️⃣ Daño de paquetería',
            '2️⃣ Producto roto de origen',
            '3️⃣ Producto incorrecto',
            '4️⃣ Paquete incompleto',
            '5️⃣ Producto defectuoso de fábrica',
        ],
        { capture: true },
        async (ctx, { flow }) => {
            // Guardar el motivo seleccionado
            const motivo = ctx.body;
            flowMotivoDevolucion.addAnswer('📅 ¿En qué fecha recibiste el producto?', { capture: true });
        }
    )
    .addAnswer(
        '✍️ Explica brevemente el motivo de tu devolución',
        { capture: true },
        async (ctx, { flow }) => {
            const explicacion = ctx.body;
            // Guardar la explicación
            flowMotivoDevolucion.addAnswer(
                '📸 Por favor, envía imágenes o videos del producto/paquete dañado o defectuoso',
                { capture: true }
            );
        }
    )
    .addAnswer(
        '📝 Por favor, proporciona el número de tu pedido:',
        { capture: true }
    )
    .addAnswer(
        '🎟️ Proporciona el número de ticket asociado a la compra:',
        { capture: true }
    )
    .addAnswer(
        '👤 Proporciona tu número de cliente:',
        { capture: true }
    )
    .addAnswer(
        '📦 Proporciónanos los productos a devolver. Por favor, incluye el SKU y la cantidad en el siguiente formato:',
        'SKU: [SKU_PRODUCTO], Cantidad: [CANTIDAD]',
        { capture: true }
    )
    .addAnswer('✅ ¡Gracias por proporcionar toda la información! Un asesor se pondrá en contacto contigo para continuar con el proceso.')
    .addAnswer(
        '👉 Si tienes alguna otra pregunta, no dudes en escribir *Soporte* para hablar con un asesor.'
    );


const flowPrincipal = addKeyword(['Devolucion', 'devolucion', 'Devolución', 'devolución'])
.addAnswer('🙌 Hola, gracias por contactarte, iniciemos el proceso de devolución.')
.addAnswer(
    [
        'A continuación te muestro los pasos a seguir para realizar la devolución:',
        '👉 Llenas la solicitud de devolución',
        '👉 Un asesor la recibe y te contacta en caso de requerir mayor información',
        '👉 En caso de que la devolución a sucursal se apruebe, el asesor te contacta y te pide un depósito para el envío de la devolución',
        '👉 El asesor te comparte una guía de envío para que mandes los productos a una de nuestras sucursales',
        '👉 Una vez que recibimos el producto en nuestra sucursal, daremos una resolución a tu devolución en las próximas 48 hrs',
        '👉 Si la resolución de devolución es aprobada, se te otorgará una nota de crédito. Si la resolución es rechazada, te notificaremos el motivo.',
        'Para más información puedes revisar nuestra *Política de devoluciones y garantías*: https://www.tiendanube.com/ayuda/politicas-de-devolucion-y-garantia',
    ]
)
.addAnswer(
        '👉 Para iniciar la devolución, escribe *Iniciar devolución*',
    null,
    null,
    [flowMotivoDevolucion]
);


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
