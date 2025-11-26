<!--
    ---
     <ScheamaOneOf = ["schema1", "schema2"]>
        <SchemaComponent>
            - Foo
            - Bar

         <SchemaComponent>
         <SchemaComponent>

         </SchemaComponent>
        </SchemaOneOf>

     </SchemaOneOf>

  </SchemaComponent>
*/

oneOf: [
{
"schema1"
},
{
"schema2"
},
{
"schema3"
}
]
first past

=> <summary>schema1</summary>
=> <summary>schema2</summary>
=> <summary>schema3</summary>

zachsSummary = one Of children[<summary>,....]

oneOfEditSchemaOneOf(zachsSummary, all of hte schemas from the doc)

<div>

schema1Content = editSchema(RootContent[], schema1) -> RootContentWithSchemaComponent
schema2Content = editSchema(RootContent[], schema2) -> RootContentWithSchemaComponent
//Zach mutates schema1 and turns it into param1Content
//Zach mutates schema2 and turns it into param2Content

param1Content = editParam(param1Content,paramSchema1)-> RootContentWithSchemaParamTitleComponent
param2Content = editParam(param2Content, paramSchema2)->RootContentWithSchemaParamTitleComponent
//Zach aggregates the results of the param edits into another child of the document
paramsContent = {
type: "text",
children: [param1Content, param2Content]
}
//renderer will agregate all params into RootContent with children
paramsContent = editParams(paramsContent, openrpcDoc.params)=> RootContentWrappedWithWhateverMegaComponent

methodContent = {
type: "text"
children: paramsContent
}

editMethod

Things that need to be document

- Oneof example for the ors
- Example markdown
- Package reduction
- Interactive try it now components to be done regardless

</div>
-->
