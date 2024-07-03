/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/record', 'N/redirect', 'N/ui/serverWidget'],
    /**
 * @param{record} record
 * @param{redirect} redirect
 * @param{serverWidget} serverWidget
 */
    (record, redirect, serverWidget) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {
            if (scriptContext.request.method === 'GET') {
                let form = serverWidget.createForm({
                    title: "Customer Record Form"
                });
 
                form.addField({
                    id: 'jj_name',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Name'
 
                }).isMandatory = true;
 
                form.addField({
                    id: 'jj_phone',
                    type: serverWidget.FieldType.PHONE,
                    label: 'Phone'
 
                })
 
                form.addField({
                    id: 'jj_email',
                    type: serverWidget.FieldType.EMAIL,
                    label: 'Email'
 
                })
 
                form.addField({
                    id: 'jj_father',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Father Name'
 
                })
 
                form.addField({
                    id: 'jj_address',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Address'
 
                })
 
                form.addField({
                    id: 'jj_age',
                    type: serverWidget.FieldType.INTEGER,
                    label: 'Age'
 
                })
 
                form.addSubmitButton({
                    label: 'Submit'
                });
 
                scriptContext.response.writePage(form);
 
            } else {
               
                let request = scriptContext.request;
                let name = request.parameters.jj_name;
                let email = request.parameters.jj_email;
                let phone = request.parameters.jj_phone;
                let age = request.parameters.jj_age;
                let address = request.parameters.jj_address;
                let father = request.parameters.jj_father;
 
                let cusRec = record.create({
                    type: 'customrecord_jj_customer_reg_form',
                        isDynamic: true
                });
 
                cusRec.setValue({
                    fieldId: 'name',
                    value: name
                });
 
                cusRec.setValue({
                    fieldId: 'custrecord_jj_reg_email',
                    value: email
                });
 
                cusRec.setValue({
                    fieldId: 'custrecord_jj_reg_phone_number',
                    value: phone
                });
 
                cusRec.setValue({
                    fieldId: 'custrecord_jj_reg_age',
                    value: age
                });
 
                cusRec.setValue({
                    fieldId: 'custrecord_jj_reg_address',
                    value: address
                });
 
                cusRec.setValue({
                    fieldId: 'custrecord_jj_reg_father_name',
                    value: father
                });
 
                let cusRecId = cusRec.save();
   
               
                scriptContext.response.write('Patient information submitted successfully!<br>');
                scriptContext.response.write('Name: ' + name + '<br>');
                scriptContext.response.write('Email: ' + email + '<br>');
                scriptContext.response.write('Phone: ' + phone + '<br>');
                scriptContext.response.write('Address: ' + address + '<br>');
                scriptContext.response.write('Father: ' + father + '<br>');
                scriptContext.response.write('Age: ' + age + '<br>');
                scriptContext.response.write('Patient Record ID: ' + cusRecId + '<br>');
            }
        }
 
        return {onRequest}
 
    });