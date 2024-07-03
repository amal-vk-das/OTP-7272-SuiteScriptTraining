/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 */
define(['N/record', 'N/search'],
    /**
     * @param {record} record
     * @param {search} search
     */
    (record, search) => {
        /**
         * Defines the function that is executed when a GET request is sent to a RESTlet.
         * @param {Object} requestParams - Parameters from HTTP request URL; parameters passed as an Object (for all supported
         *     content types)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        const get = (requestParams) => {
            try {
                let customerId = requestParams.id;

                let customerOverdueSearch = search.create({
                    type: search.Type.INVOICE,
                    filters: [
                        ["entity", "anyof", customerId],
                        "AND",
                        ["daysoverdue", "greaterthan", "0"],
                        'AND',
                        ['mainline', 'is', 'T']
                    ],
                    columns: ["internalid", "entity", "trandate", "amountremaining", "daysoverdue"],
                });

                let searchResult = customerOverdueSearch.run().getRange(0, 100);

                if (searchResult.length > 0) {
                    return searchResult.map(invoice => ({
                        internalId: invoice.getValue('internalid'),
                        customerName: invoice.getText('entity'),
                        invoiceDate: invoice.getValue('trandate'),
                        overdueBalance: invoice.getValue('amountremaining'),
                        daysOverdue: invoice.getValue('daysoverdue')
                    }));

                } 
                else {
                    return "No overdue";
                }
            } catch (e) {
                log.error({
                    title: 'Error in get function',
                    details: e
                });
                return "An error occurred while retrieving overdue invoices";
            }
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
            // PUT logic here
        };

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
            // POST logic here
        };

        /**
         * Defines the function that is executed when a DELETE request is sent to a RESTlet.
         * @param {Object} requestParams - Parameters from HTTP request URL; parameters are passed as an Object (for all supported
         *     content types)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        const doDelete = (requestParams) => {
        };

        return { get, put, post, delete: doDelete };
    });
