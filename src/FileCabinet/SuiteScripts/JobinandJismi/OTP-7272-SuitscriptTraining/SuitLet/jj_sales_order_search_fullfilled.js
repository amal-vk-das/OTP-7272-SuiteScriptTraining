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
        let currentRecord = scriptContext.currentRecord;
        let sublistId = scriptContext.sublistId;
        let fieldId = scriptContext.fieldId;
        let line = scriptContext.line;

      let form = serverWidget.createForm({
        title: "Sales Orders to Fulfill or Bill",
      });

      // let subsidiaryField = form.addField({
      //   id: "custpage_subsidiary",
      //   type: serverWidget.FieldType.SELECT,
      //   label: "Subsidiary",
      //   source: "subsidiary",
      // });

      // var customerField = form.addField({
      //   id: "custpage_customer",
      //   type: serverWidget.FieldType.SELECT,
      //   label: "Customer",
      //   source: "customer",
      // });

      // form.addSubmitButton({
      //   label: "Filter",
      // });

      let sublist = form.addSublist({
        id: "custpage_salesorders",
        type: serverWidget.SublistType.LIST,
        label: "Sales Orders",
      });

      sublist.addField({
        id: "custpage_internalid",
        type: serverWidget.FieldType.TEXT,
        label: "Internal ID",
      });
      sublist.addField({
        id: "custpage_documentname",
        type: serverWidget.FieldType.TEXT,
        label: "Document Name",
      });
      sublist.addField({
        id: "custpage_date",
        type: serverWidget.FieldType.DATE,
        label: "Date",
      });
      sublist.addField({
        id: "custpage_status",
        type: serverWidget.FieldType.TEXT,
        label: "Status",
      });
      sublist.addField({
        id: "custpage_customername",
        type: serverWidget.FieldType.TEXT,
        label: "Customer Name",
      });
      sublist.addField({
        id: "custpage_subsidiary",
        type: serverWidget.FieldType.TEXT,
        label: "Subsidiary",
      });

    //   sublist.addField({
    //     id: "custpage_department",
    //     type: serverWidget.FieldType.TEXT,
    //     label: "Department",
    //   });
    //   sublist.addField({
    //     id: "custpage_class",
    //     type: serverWidget.FieldType.TEXT,
    //     label: "Class",
    //   });
      sublist.addField({
        id: "custpage_line",
        type: serverWidget.FieldType.TEXT,
        label: "Line Number",
      });
    //   sublist.addField({
    //     id: "custpage_subtotal",
    //     type: serverWidget.FieldType.CURRENCY,
    //     label: "Subtotal",
    //   });
    //   sublist.addField({
    //     id: "custpage_tax",
    //     type: serverWidget.FieldType.CURRENCY,
    //     label: "Tax",
    //   });
      sublist.addField({
        id: "custpage_total",
        type: serverWidget.FieldType.CURRENCY,
        label: "Total",
      });
      //Internal ID, Document Name, Date, Status, Customer Name, Subsidiary, Department, Class, Line Number, Subtotal, Tax, Total

      let salesOrderSearch = search.create({
        type: search.Type.SALES_ORDER,
        filters: [
          ["mainline", "is", "T"],
          "AND",
          ["status", "anyof", "SalesOrd:B", "SalesOrd:D"],
        ],
        columns: [
          "internalid",
          "tranid",
          "trandate",
          "status",
          "entity",
          "subsidiary",
        //   "department",
        //   "class",
          "line",
        //   "subtotal",
        //   "taxtotal",
          "total",
        ],
      });

      let salesOrderResults = salesOrderSearch
        .run()
        .getRange({ start: 0, end: 100 });

      for (let i = 0; i < salesOrderResults.length; i++) {
        let result = salesOrderResults[i];
        sublist.setSublistValue({
          id: "custpage_internalid",
          line: i,
          value: result.getValue({ name: "internalid" }),
        });
        sublist.setSublistValue({
          id: "custpage_documentname",
          line: i,
          value: result.getValue({ name: "tranid" }),
        });
        sublist.setSublistValue({
          id: "custpage_date",
          line: i,
          value: result.getValue({ name: "trandate" }),
        });
        sublist.setSublistValue({
          id: "custpage_status",
          line: i,
          value: result.getValue({ name: "status" }),
        });
        sublist.setSublistValue({
          id: "custpage_customername",
          line: i,
          value: result.getText({ name: "entity" }),
        });
        sublist.setSublistValue({
          id: "custpage_subsidiary",
          line: i,
          value: result.getText({ name: "subsidiary" }),
        });
        // sublist.setSublistValue({
        //   id: "custpage_department",
        //   line: i,

        //   value: result.getValue({ name: "department" }),
        // });

        // sublist.setSublistValue({
        //   id: "custpage_class",
        //   line: i,
        //   value: result.getValue({ name: "class" }),
        // });
        sublist.setSublistValue({
          id: "custpage_line",
          line: i,
          value: result.getValue({ name: "line" }),
        });
        // sublist.setSublistValue({
        //   id: "custpage_subtotal",
        //   line: i,
        //   value: result.getValue({ name: "subtotal" }),
        // });
        // sublist.setSublistValue({
        //   id: "custpage_tax",
        //   line: i,
        //   value: result.getValue({ name: "taxtotal" }),
        // });
        sublist.setSublistValue({
          id: "custpage_total",
          line: i,
          value: result.getValue({ name: "total" }),
        });
      }

      scriptContext.response.writePage(form);
    }
  };

  return { onRequest };
});
