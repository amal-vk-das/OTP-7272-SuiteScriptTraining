/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(["N/record", "N/search", "N/ui/serverWidget"], /**
 * @param{record} record
 * @param{search} search
 * @param{serverWidget} serverWidget
 */ (record, search, serverWidget) => {
  /**
   * Defines the Suitelet script trigger point.
   * @param {Object} scriptContext
   * @param {ServerRequest} scriptContext.request - Incoming request
   * @param {ServerResponse} scriptContext.response - Suitelet response
   * @since 2015.2
   */
  const onRequest = (scriptContext) => {
    if (scriptContext.request.method === "GET") {
      let form = serverWidget.createForm({
        title: "Customer Form",
      });

      let sublist = form.addSublist({
        id: "_jj_sales_order_table",
        type: serverWidget.SublistType.LIST,
        label: "Sales Order List",
      });
      sublist.addField({
        id: "custpage_jj_sales_order_docnum",  
        type: serverWidget.FieldType.TEXT,
        label: "Document Number",
    });
    sublist.addField({
        id: "custpage_jj_customer_name",  
        type: serverWidget.FieldType.TEXT,
        label: "Customer Name",
    });
    sublist.addField({
        id: "custpage_jj_subsidiary",  
        type: serverWidget.FieldType.TEXT,
        label: "Subsidiary",
    });
    sublist.addField({
        id: "custpage_jj_date",
        type: serverWidget.FieldType.DATE,
        label: "Date",
    });
    

      let salesOrderSearch = search.create({
        type: search.Type.SALES_ORDER,
        filters: [["mainline", "is", "T"]],
        columns: ["tranid", "entity", "subsidiary", "trandate"],
      });

      let salesOrderResults = salesOrderSearch.run().getRange({ start: 0, end: 100 });

      for (let i = 0; i < salesOrderResults.length; i++) {
        let result = salesOrderResults[i];
        sublist.setSublistValue({
          id: "custpage_jj_sales_order_docnum",
          line: i,
          value: result.getValue("tranid"),
        });
        sublist.setSublistValue({
          id: "custpage_jj_customer_name",
          line: i,
          value: result.getText("entity"),
        });
        sublist.setSublistValue({
          id: "custpage_jj_subsidiary",
          line: i,
          value: result.getText("subsidiary"),
        });
        sublist.setSublistValue({
          id: "custpage_jj_date",
          line: i,
          value: result.getValue("trandate"),
        });
      }
      

      scriptContext.response.writePage(form);
    }
  };

  return { onRequest };
});
