/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(["N/email", "N/record", "N/runtime", "N/search"]
/**
 * @param{email} email
 * @param{record} record
 * @param{runtime} runtime
 * @param{search} search
 */, (email, record, runtime, search) => {

  const afterSubmit = (scriptContext) => {
    if (scriptContext.type !== scriptContext.UserEventType.CREATE) {
      return;
    }

    let newRecord = scriptContext.newRecord;
    let customerId = newRecord.getValue("entity");


    let salesOrderSearch = search.create({
      type: search.Type.SALES_ORDER,
      filters: [
        ["entity", "anyof", customerId],
        "AND",
        ["status", "anyof", "SalesOrd:A", "SalesOrd:B", "SalesOrd:D","SalesOrd:E","SalesOrd:F"],
        'AND',
        ['mainline', 'is', 'T']
      ],
      columns: ["internalid"],
    });

    let searchResults = salesOrderSearch.run();
    let openSalesOrderCount = 0;
    searchResults.each(result => {
      openSalesOrderCount++;
      return true;
    });

    if (openSalesOrderCount > 5) {
      let customerRecord = record.load({
        type: record.Type.CUSTOMER,
        id: customerId,
      });
      let salesRepId = customerRecord.getValue("salesrep");

      if (salesRepId) {
        let senderId = runtime.getCurrentUser().id;
        let recipientId = salesRepId;
        let subject = "Customer has more than 5 open sales orders";
        let body =
          "The customer with ID " +
          customerId +
          " has more than 5 open sales orders.";

        email.send({
          author: senderId,
          recipients: recipientId,
          subject: subject,
          body: body,
        });
      }
    }
    else{
        log.debug("Customer has less than or equal to 5 open sales orders.");
    }
  };

  return {afterSubmit };
});