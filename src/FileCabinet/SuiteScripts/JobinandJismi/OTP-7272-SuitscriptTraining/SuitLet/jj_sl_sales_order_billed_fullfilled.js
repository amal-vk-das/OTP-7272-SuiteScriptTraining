/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 */
define(['N/ui/serverWidget', 'N/search', 'N/log'], function (serverWidget, search, log) {

    function onRequest(context) {
      if (context.request.method === 'GET') {
        let form = serverWidget.createForm({
          title: 'Sales Orders to Fulfill or Bill',
        });
  
        let subsidiaryField = form.addField({
          id: 'custpage_subsidiary',
          type: serverWidget.FieldType.SELECT,
          label: 'Subsidiary',
          source: 'subsidiary', 
        });
  
        var customerField = form.addField({
          id: 'custpage_customer',
          type: serverWidget.FieldType.SELECT,
          label: 'Customer',
          source: 'customer', 
        });
  
        form.addSubmitButton({
          label: 'Filter',
        });
  
        var sublist = form.addSublist({
          id: 'custpage_salesorders',
          type: serverWidget.SublistType.LIST,
          label: 'Sales Orders',
        });
  
        sublist.addField({
          id: 'custpage_internalid',
          type: serverWidget.FieldType.TEXT,
          label: 'Internal ID',
        });
        sublist.addField({
          id: 'custpage_documentname',
          type: serverWidget.FieldType.TEXT,
          label: 'Document Name',
        });
        sublist.addField({
          id: 'custpage_date',
          type: serverWidget.FieldType.DATE,
          label: 'Date',
        });
        sublist.addField({
          id: 'custpage_status',
          type: serverWidget.FieldType.TEXT,
          label: 'Status',
        });
        sublist.addField({
          id: 'custpage_customername',
          type: serverWidget.FieldType.TEXT,
          label: 'Customer Name',
        });
        sublist.addField({
          id: 'custpage_subsidiary_sublist',
          type: serverWidget.FieldType.TEXT,
          label: 'Subsidiary',
        });
        sublist.addField({
          id: 'custpage_department',
          type: serverWidget.FieldType.TEXT,
          label: 'Department',
        });
        sublist.addField({
          id: 'custpage_class',
          type: serverWidget.FieldType.TEXT,
          label: 'Class',
        });
        sublist.addField({
          id: 'custpage_linenumber',
          type: serverWidget.FieldType.TEXT,
          label: 'Line Number',
        });
        sublist.addField({
          id: 'custpage_subtotal',
          type: serverWidget.FieldType.CURRENCY,
          label: 'Subtotal',
        });
        sublist.addField({
          id: 'custpage_tax',
          type: serverWidget.FieldType.CURRENCY,
          label: 'Tax',
        });
        sublist.addField({
          id: 'custpage_total',
          type: serverWidget.FieldType.CURRENCY,
          label: 'Total',
        });
  
        var filters = [];
        if (context.request.parameters.custpage_subsidiary) {
          filters.push(
            search.createFilter({
              name: 'subsidiary',
              operator: search.Operator.ANYOF,
              values: context.request.parameters.custpage_subsidiary,
            })
          );
        }
        if (context.request.parameters.custpage_customer) {
          filters.push(
            search.createFilter({
              name: 'entity',
              operator: search.Operator.ANYOF,
              values: context.request.parameters.custpage_customer,
            })
          );
        }
        filters.push(
          search.createFilter({
            name: 'status',
            operator: search.Operator.ANYOF,
            values: ['SalesOrd:B', 'SalesOrd:D'],
          })
        );
  
        let salesOrderSearch = search.create({
          type: search.Type.SALES_ORDER,
          filters: filters,
          columns: [
            'internalid',
            'tranid',
            'trandate',
            'status',
            'entity',
            'subsidiary',
            'department',
            'class',
            'line',
            'amount',
            'taxamount',
            'total',
          ],
        });
  
        var resultSet = salesOrderSearch.run();
        var results = resultSet.getRange({
          start: 0,
          end: 1000,
        });
  
        for (var i = 0; i < results.length; i++) {
          sublist.setSublistValue({
            id: 'custpage_internalid',
            line: i,
            value: results[i].getValue('internalid'),
          });
          sublist.setSublistValue({
            id: 'custpage_documentname',
            line: i,
            value: results[i].getValue('tranid'),
          });
          sublist.setSublistValue({
            id: 'custpage_date',
            line: i,
            value: results[i].getValue('trandate'),
          });
          sublist.setSublistValue({
            id: 'custpage_status',
            line: i,
            value: results[i].getText('status'),
          });
          sublist.setSublistValue({
            id: 'custpage_customername',
            line: i,
            value: results[i].getText('entity'),
          });
          sublist.setSublistValue({
            id: 'custpage_subsidiary_sublist',
            line: i,
            value: results[i].getText('subsidiary'),
          });
          sublist.setSublistValue({
            id: 'custpage_department',
            line: i,
            value: results[i].getText('department'),
          });
          sublist.setSublistValue({
            id: 'custpage_class',
            line: i,
            value: results[i].getText('class'),
          });
          sublist.setSublistValue({
            id: 'custpage_linenumber',
            line: i,
            value: results[i].getValue('line'),
          });
          sublist.setSublistValue({
            id: 'custpage_subtotal',
            line: i,
            value: results[i].getValue('amount'),
          });
          sublist.setSublistValue({
            id: 'custpage_tax',
            line: i,
            value: results[i].getValue('taxamount'),
          });
          sublist.setSublistValue({
            id: 'custpage_total',
            line: i,
            value: results[i].getValue('total'),
          });
        }
  
        context.response.writePage(form);
  
      }
    }
  
    return {
      onRequest: onRequest
    };
  
  });
  