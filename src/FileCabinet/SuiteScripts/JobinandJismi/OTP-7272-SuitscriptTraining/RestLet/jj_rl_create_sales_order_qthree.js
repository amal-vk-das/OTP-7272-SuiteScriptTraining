/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 */
define(['N/record'],
    /**
     * @param {record} record
     */
    (record) => {
        /**
         * Defines the function that is executed when a GET request is sent to a RESTlet.
         * @param {Object} requestParams - Parameters from HTTP request URL; parameters passed as an Object (for all supported
         *     content types)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        const get = (requestParams) => {

        }

        /**
         * Defines the function that is executed when a PUT request is sent to a RESTlet.
         * @param {string | Object} requestBody - The HTTP request body; request body are passed as a string when request
         *     Content-Type is 'text/plain' or parsed into an Object when request Content-Type is 'application/json' (in which case
         *     the body must be a valid JSON)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        const put = (requestBody) => {

        }

        /**
         * Defines the function that is executed when a POST request is sent to a RESTlet.
         * @param {string | Object} requestBody - The HTTP request body; request body is passed as a string when request
         *     Content-Type is 'text/plain' or parsed into an Object when request Content-Type is 'application/json' (in which case
         *     the body must be a valid JSON)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        const post = (requestBody) => {
            try {
                let salesOrder = record.create({
                    type: record.Type.SALES_ORDER,
                    isDynamic: true
                });

                salesOrder.setValue({
                    fieldId: 'entity',
                    value: requestBody.entity    //1670
                });

                salesOrder.selectNewLine({
                    sublistId: 'item'
                });

                salesOrder.setCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'item',    //328
                    value: requestBody.item
                });

                salesOrder.setCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'quantity',
                    value: requestBody.quantity
                });

                salesOrder.commitLine({
                    sublistId: 'item'
                });

                let salesOrderId = salesOrder.save({
                    enableSourcing: true,
                    ignoreMandatoryFields: true
                });

                let salesOrderResult = {
                    salesOrderId: salesOrderId,
                    salesOrderCustomer: salesOrder.getValue('entity'),
                    salesOrderDate: salesOrder.getValue('trandate'),
                    salesOrderTotal: salesOrder.getValue('total')
                };

                log.debug('Sales Order Created with internal id: ', salesOrderId);
                return salesOrderResult;
            } catch (e) {
                log.error("Error creating sales order: ", e.toString());
                return { error: e.toString() };
            }
        }

        /**
         * Defines the function that is executed when a DELETE request is sent to a RESTlet.
         * @param {Object} requestParams - Parameters from HTTP request URL; parameters are passed as an Object (for all supported
         *     content types)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        const doDelete = (requestParams) => {

        }

        return { get, put, post, delete: doDelete }

    });
