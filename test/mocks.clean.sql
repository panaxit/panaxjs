if object_id('[TestSchema].[CONTROLS_Basic]', 'U') is not null
		exec('drop table [TestSchema].[CONTROLS_Basic]')

if object_id('[TestSchema].[Domicilio]', 'U') is not null
		exec('drop table [TestSchema].[Domicilio]')

if object_id('[TestSchema].[Telefonos]', 'U') is not null
		exec('drop table [TestSchema].[Telefonos]')

if object_id('[TestSchema].[Pais]', 'U') is not null
		exec('drop table [TestSchema].[Pais]')

if object_id('[TestSchema].[Empleado]', 'U') is not null
		exec('drop table [TestSchema].[Empleado]')

if object_id('[TestSchema].[CONTROLS_NestedGrid]', 'U') is not null
		exec('drop table [TestSchema].[CONTROLS_NestedGrid]')

if object_id('[TestSchema].[CONTROLS_NestedForm]', 'U') is not null
		exec('drop table [TestSchema].[CONTROLS_NestedForm]')