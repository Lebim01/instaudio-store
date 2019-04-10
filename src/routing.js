let HOST = `http://104.248.214.60/api-admin/index.php`

module.exports = {
    LOGIN : `${HOST}/admin/login`,
    AUTH : `${HOST}/admin/auth`,

    INVENTORY : `${HOST}/inventario`,
    ADD_INVENTORY : `${HOST}/inventario/save`,
    SUGGESTED_PRICES : `${HOST}/inventario/suggestedPrices`,

    SALES : `${HOST}/ventas`,
    ADD_SALE : `${HOST}/ventas/save`,
    LIST_SELL : `${HOST}/ventas/list`,
    SELL_ONE : `${HOST}/ventas/one`,

    LIST_LINEAS : `${HOST}/lineas/list`,
    ONE_LINEAS : `${HOST}/lineas/one`,
    SAVE_LINEAS : `${HOST}/lineas/save`,
    DELETE_LINEAS : `${HOST}/lineas/delete`,

    LIST_PRODUCTS : `${HOST}/productos/list`,
    CHANGE_STATUS_PRODUCTS : `${HOST}/productos/status`,
    SAVE_PRODUCTS : `${HOST}/productos/save`,
    DELETE_PRODUCTS : `${HOST}/productos/delete`,
    ONE_PRODUCTS : `${HOST}/productos/one`,
    GET_PRODUCT_CODE : `${HOST}/productos/oneCode`,
    UP_PHOTOS_PRODUCTS : `${HOST}/productos/upPhoto`,
    DELETE_PHOTO_PRODUCT : `${HOST}/productos/deletePhoto`,
    FAVORITE_PHOTO_PRODUCT : `${HOST}/productos/favoritePhoto`,
    CHANGE_PRICE_PRODUCTS : `${HOST}/productos/changePrice`,
    SEARCH_PRODUCT : `${HOST}/productos/search`,
    GET_PRODUCT : `${HOST}/productos/get`,
    LIST_PRICE_PRODUCT : `${HOST}/productos/historyPrice`,

    LIST_CLIENTS : `${HOST}/clientes/list`,
    ONE_CLIENTS : `${HOST}/clientes/one`,
    SAVE_CLIENTS : `${HOST}/clientes/save`,
    DELETE_CLIENTS : `${HOST}/clientes/delete`,
    LIST_MARCAS : `${HOST}/marcas/list`,
    ONE_MARCAS : `${HOST}/marcas/one`,
    SAVE_MARCAS : `${HOST}/marcas/save`,
    DELETE_MARCAS : `${HOST}/marcas/delete`,

    ONE_INICIO : `${HOST}/inicio/one`,
    UP_IMAGE_INICIO : `${HOST}/inicio/upImage`,
    DELETE_IMAGE_INICIO : `${HOST}/inicio/deleteImage`,

    
}