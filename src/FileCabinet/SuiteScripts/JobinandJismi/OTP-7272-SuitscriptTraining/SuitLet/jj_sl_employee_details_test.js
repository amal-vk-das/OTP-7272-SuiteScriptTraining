/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(["N/record", "N/search", "N/ui/serverWidget"], (record, search, serverWidget) => {
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
          title: "Employee Details",
        });
  
    
        let sublist = form.addSublist({
          id: "custpage_employee_details",
          type: serverWidget.SublistType.LIST,
          label: "Employee Information",
        });
  
        
        sublist.addField({
          id: "custpage_name",
          type: serverWidget.FieldType.TEXT,
          label: "Employee Name",
        });
        sublist.addField({
          id: "custpage_department",
          type: serverWidget.FieldType.TEXT,
          label: "Department",
        });
        sublist.addField({
          id: "custpage_status",
          type: serverWidget.FieldType.TEXT,
          label: "Status",
        });

        let employeeSearch = search.create({
          type: search.Type.EMPLOYEE,
          columns: ["firstname", "department", "isinactive",'internalid'],
        });
  
        let employeeSearchResult = employeeSearch.run().getRange({ start: 0, end: 10 });
  
        for (let i = 0; i < employeeSearchResult.length; i++) {
          let result = employeeSearchResult[i];
          sublist.setSublistValue({
            id: "custpage_name",
            line: i,
            value: result.getValue("firstname"),
          });
          let department = result.getText("department");
          if (department) {
            sublist.setSublistValue({
              id: "custpage_department",
              line: i,
              value: department,
            });
          }
  
          let activeStatus = result.getValue("isinactive");
          if (activeStatus === true) {
            sublist.setSublistValue({
              id: "custpage_status",
              line: i,
              value: "InActive",
            });
          } else {
            sublist.setSublistValue({
              id: "custpage_status",
              line: i,
              value: "Active",
            });
          }
        }
  

        form.addSubmitButton({
          label: "Submit",
        });
  

        scriptContext.response.writePage(form);
  
      } else if (scriptContext.request.method === "POST") {
        let data = scriptContext.request.parameters;
  
        for (let i = 0; i < data.length; i++) {
          let empName = data.custpage_name[i];
          let department = data.custpage_department[i];
          let status = data.custpage_status[i];
  
          let customRecord = record.create({
            type: "customrecord_jj_employee_details",
            isDynamic: true,
          });
  
          customRecord.setValue({
            fieldId: "custrecord_jj_employee_name",
            value: empName,
          });
  
          customRecord.setValue({
            fieldId: "custrecord_jj_department",
            value: department,
          });
  
          if (status === "Active") {
            customRecord.setValue({
              fieldId: "custrecord_jj_status",
              value: "OnLeave",
            });
          } else if (status === "InActive") {
            customRecord.setValue({
              fieldId: "custrecord_jj_status",
              value: "Terminated",
            });
          }
  
          let cusRecId = customRecord.save();
        }
        scriptContext.response.write("Employee records submitted successfully");
      }
    };
  
    return { onRequest };
  });
  