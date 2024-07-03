/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 */
define(["N/record", "N/search"], /**
 * @param{record} record
 * @param{search} search
 */ (record, search) => {
  /**
   * Defines the function that is executed when a GET request is sent to a RESTlet.
   * @param {Object} requestParams - Parameters from HTTP request URL; parameters passed as an Object (for all supported
   *     content types)
   * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
   *     Object when request Content-Type is 'application/json' or 'application/xml'
   * @since 2015.2
   */
  const get = (requestParams) => {
    let salesOrderId = requestParams.id;
    try {
      var salesOrder = record.load({
        type: record.Type.SALES_ORDER,
        id: salesOrderId,
        isDynamic: true,
      });
    } catch (e) {
      log.error({
        title: "Invalid Sales Order ID",
        details: `Unable to load Sales Order with ID: ${salesOrderId}`,
      });
      return (`error:Invalid Sales Order ID: ${salesOrderId}` );
    }

    let itemCount = salesOrder.getLineCount({
      sublistId: "item",
    });

    let message =
      itemCount > 2 ? "Sales order contains more than 2 items" : "no";

    let salesOrderItems = [];

    for (let line = 0; line < itemCount; line++) {
      let salesOrderObj = salesOrder.getSublistText({
        sublistId: "item",
        fieldId: "item",
        line: line,
      });

      let quantity = salesOrder.getSublistValue({
        sublistId: "item",
        fieldId: "quantity",
        line: line,
      });

      let rate = salesOrder.getSublistValue({
        sublistId: "item",
        fieldId: "rate",
        line: line,
      });

      let amount = salesOrder.getSublistValue({
        sublistId: "item",
        fieldId: "amount",
        line: line,
      });

      salesOrderItems.push({ salesOrderObj, quantity, rate, amount });
    }

    return { message, salesOrderItems };
  };

  /**
   * Defines the function that is executed when a PUT request is sent to a RESTlet.
   * @param {string | Object} requestBody - The HTTP request body; request body are passed as a string when request
   *     Content-Type is 'text/plain' or parsed into an Object when request Content-Type is 'application/json' (in which case
   *     the body must be a valid JSON)
   * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
   *     Object when request Content-Type is 'application/json' or 'application/xml'
   * @since 2015.2
   */
  const put = (requestBody) => {};

  /**
   * Defines the function that is executed when a POST request is sent to a RESTlet.
   * @param {string | Object} requestBody - The HTTP request body; request body is passed as a string when request
   *     Content-Type is 'text/plain' or parsed into an Object when request Content-Type is 'application/json' (in which case
   *     the body must be a valid JSON)
   * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
   *     Object when request Content-Type is 'application/json' or 'application/xml'
   * @since 2015.2
   */
  const post = (requestBody) => {};

  /**
   * Defines the function that is executed when a DELETE request is sent to a RESTlet.
   * @param {Object} requestParams - Parameters from HTTP request URL; parameters are passed as an Object (for all supported
   *     content types)
   * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
   *     Object when request Content-Type is 'application/json' or 'application/xml'
   * @since 2015.2
   */
  const doDelete = (requestParams) => {};

  return { get, put, post, delete: doDelete };
});
