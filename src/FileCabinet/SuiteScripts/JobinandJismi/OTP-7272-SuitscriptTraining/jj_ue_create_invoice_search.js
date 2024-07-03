/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(["N/search"], /**
 * @param {search} search
 */
(search) => {
  /**
   * Defines the function definition that is executed before record is loaded.
   * @param {Object} scriptContext
   * @param {Record} scriptContext.newRecord - New record
   * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
   * @param {Form} scriptContext.form - Current form
   * @param {ServletRequest} scriptContext.request - HTTP request information sent from the browser for a client action only.
   * @since 2015.2
   */
  const beforeLoad = (scriptContext) => {
    let invoiceSearch = search.create({
      type: search.Type.INVOICE,
      title: "Invoice Search JJ",
      id: "customsearch_jj_invoice_search",
      columns: [
        { name: "tranid" },
        { name: "trandate" },
        { name: "entity" },
        { name: "email", join: "customer" },
        { name: "amount" },
      ],
      filters: [["status", "anyof", "CustInvc:A"]],
    });

    invoiceSearch.run().each(function (result) {
      let documentNumber = result.getValue({ name: "tranid" });
      let date = result.getValue({ name: "trandate" });
      let customerName = result.getText({ name: "entity" });
      let customerEmail = result.getValue({ name: "email", join: "customer" });
      let amount = result.getValue({ name: "amount" });

      log.debug({
        title: "Open Invoice",
        details: `Document Number: ${documentNumber}, Date: ${date}, Customer Name: ${customerName}, Customer Email: ${customerEmail}, Amount: ${amount}`,
      });

      return true;
    });
  };

  /**
   * Defines the function definition that is executed before record is submitted.
   * @param {Object} scriptContext
   * @param {Record} scriptContext.newRecord - New record
   * @param {Record} scriptContext.oldRecord - Old record
   * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
   * @since 2015.2
   */
  const beforeSubmit = (scriptContext) => {
    // Your beforeSubmit logic here
  };

  /**
   * Defines the function definition that is executed after record is submitted.
   * @param {Object} scriptContext
   * @param {Record} scriptContext.newRecord - New record
   * @param {Record} scriptContext.oldRecord - Old record
   * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
   * @since 2015.2
   */
  const afterSubmit = (scriptContext) => {
    // Your afterSubmit logic here
  };

  return { beforeLoad, beforeSubmit, afterSubmit };
});
