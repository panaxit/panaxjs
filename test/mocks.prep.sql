IF NOT EXISTS (
SELECT  schema_name
FROM    information_schema.schemata
WHERE   schema_name = 'TestSchema' ) 

BEGIN
EXEC sp_executesql N'CREATE SCHEMA TestSchema'
END

/****** Object:  Table [TestSchema].[Pais]    Script Date: 25/06/2015 05:14:57 p.m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [TestSchema].[Pais](
	[Id] [nchar](2) NOT NULL,
	[Pais] [nvarchar](255) NOT NULL,
 CONSTRAINT [PK_Paises] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

/****** Object:  Table [TestSchema].[CONTROLS_Basic]    Script Date: 25/06/2015 05:14:57 p.m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [TestSchema].[CONTROLS_Basic](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[ShortTextField] [nvarchar](255) NULL,
	[IntegerReq] [int] NOT NULL,
	[Float] [float] NULL,
	[Combobox] [nchar](2) NULL,
	[RadioGroup] [int] NULL,
	[Boolean] [bit] NULL,
	[Money] [money] NULL,
	[Timestamp] [timestamp] NULL,
	[Date] [date] NULL,
	[Datetime] [datetime] NULL,
	[Time] [time](7) NULL,
	[LongText] [text] NULL CONSTRAINT [DF_CONTROLS_Basic_LongText]  DEFAULT ('default loooong text'),
 CONSTRAINT [PK_CONTROLS_Basic] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO

/****** Object:  Table [TestSchema].[Domicilio]    Script Date: 25/06/2015 05:14:57 p.m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [TestSchema].[Domicilio](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[RFC] [nchar](14) NOT NULL,
	[Direccion] [nvarchar](50) NOT NULL,
 CONSTRAINT [PK_DatosEmpleado] PRIMARY KEY CLUSTERED 
(
	[RFC] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

/****** Object:  Table [TestSchema].[Empleado]    Script Date: 25/06/2015 05:14:57 p.m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [TestSchema].[Empleado](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Sede] [nchar](10) NOT NULL,
	[RFC] [nchar](14) NOT NULL,
	[Nombre] [nvarchar](50) NOT NULL,
	[ApellidoPaterno] [nvarchar](50) NOT NULL,
	[ApellidoMaterno] [nvarchar](50) NULL,
	[FechaNacimiento] [date] NULL,
	[FechaCaptura] [date] NULL,
 CONSTRAINT [PK_Empleado] PRIMARY KEY CLUSTERED 
(
	[RFC] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [IX_Empleado] UNIQUE NONCLUSTERED 
(
	[Sede] ASC,
	[RFC] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

/****** Object:  Table [TestSchema].[Telefonos]    Script Date: 25/06/2015 05:14:57 p.m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [TestSchema].[Telefonos](
	[Sede] [nchar](10) NOT NULL,
	[Empleado] [nchar](14) NOT NULL,
	[Telefono] [nchar](10) NOT NULL
) ON [PRIMARY]


GO
ALTER TABLE [TestSchema].[Domicilio] ADD  CONSTRAINT [DF_DatosEmpleado_RFC]  DEFAULT ('SLP') FOR [RFC]
GO
ALTER TABLE [TestSchema].[Empleado] ADD  CONSTRAINT [DF_Empleado_Sede]  DEFAULT ('SLP') FOR [Sede]
GO
ALTER TABLE [TestSchema].[Empleado] ADD  CONSTRAINT [DF_Empleado_FechaCaptura]  DEFAULT (getdate()) FOR [FechaCaptura]
GO
ALTER TABLE [TestSchema].[CONTROLS_Basic]  WITH CHECK ADD  CONSTRAINT [FK_CONTROLS_Basic_Pais] FOREIGN KEY([Combobox])
REFERENCES [TestSchema].[Pais] ([Id])
GO
ALTER TABLE [TestSchema].[CONTROLS_Basic] CHECK CONSTRAINT [FK_CONTROLS_Basic_Pais]
GO
ALTER TABLE [TestSchema].[Domicilio]  WITH CHECK ADD  CONSTRAINT [FK_DatosEmpleado_Empleado] FOREIGN KEY([RFC])
REFERENCES [TestSchema].[Empleado] ([RFC])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [TestSchema].[Domicilio] CHECK CONSTRAINT [FK_DatosEmpleado_Empleado]
GO
ALTER TABLE [TestSchema].[Telefonos]  WITH CHECK ADD  CONSTRAINT [FK_Telefonos_Empleado] FOREIGN KEY([Sede], [Empleado])
REFERENCES [TestSchema].[Empleado] ([Sede], [RFC])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [TestSchema].[Telefonos] CHECK CONSTRAINT [FK_Telefonos_Empleado]
GO
EXEC sys.sp_addextendedproperty @name=N'displayText', @value=N'Pais' , @level0type=N'SCHEMA',@level0name=N'TestSchema', @level1type=N'TABLE',@level1name=N'Pais'
GO
EXEC sys.sp_addextendedproperty @name=N'${table}[@controlType="gridView"]/${column}/@mode', @value=N'inherit' , @level0type=N'SCHEMA',@level0name=N'TestSchema', @level1type=N'TABLE',@level1name=N'CONTROLS_Basic', @level2type=N'COLUMN',@level2name=N'ShortTextField'
GO
EXEC sys.sp_addextendedproperty @name=N'@tab', @value=N'General' , @level0type=N'SCHEMA',@level0name=N'TestSchema', @level1type=N'TABLE',@level1name=N'CONTROLS_Basic', @level2type=N'COLUMN',@level2name=N'ShortTextField'
GO
EXEC sys.sp_addextendedproperty @name=N'@tabPanel', @value=N'General' , @level0type=N'SCHEMA',@level0name=N'TestSchema', @level1type=N'TABLE',@level1name=N'CONTROLS_Basic', @level2type=N'COLUMN',@level2name=N'ShortTextField'
GO
EXEC sys.sp_addextendedproperty @name=N'${table}[@controlType="gridView"]/${column}/@mode', @value=N'inherit' , @level0type=N'SCHEMA',@level0name=N'TestSchema', @level1type=N'TABLE',@level1name=N'CONTROLS_Basic', @level2type=N'COLUMN',@level2name=N'IntegerReq'
GO
EXEC sys.sp_addextendedproperty @name=N'@controlType', @value=N'combobox' , @level0type=N'SCHEMA',@level0name=N'TestSchema', @level1type=N'TABLE',@level1name=N'CONTROLS_Basic', @level2type=N'COLUMN',@level2name=N'Combobox'
GO
EXEC sys.sp_addextendedproperty @name=N'@controlType', @value=N'radiogroup' , @level0type=N'SCHEMA',@level0name=N'TestSchema', @level1type=N'TABLE',@level1name=N'CONTROLS_Basic', @level2type=N'COLUMN',@level2name=N'RadioGroup'
GO
EXEC sys.sp_addextendedproperty @name=N'@moveBefore', @value=N'Combobox' , @level0type=N'SCHEMA',@level0name=N'TestSchema', @level1type=N'TABLE',@level1name=N'CONTROLS_Basic', @level2type=N'COLUMN',@level2name=N'RadioGroup'
GO
EXEC sys.sp_addextendedproperty @name=N'@tab', @value=N'Otros' , @level0type=N'SCHEMA',@level0name=N'TestSchema', @level1type=N'TABLE',@level1name=N'CONTROLS_Basic', @level2type=N'COLUMN',@level2name=N'Money'
GO

/****** Object:  Table [TestSchema].[CONTROLS_NestedForm]    Script Date: 22/07/2015 01:00:26 p.m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [TestSchema].[CONTROLS_NestedForm](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[TextLimit10Chars] [nchar](10) NULL,
 CONSTRAINT [PK_CONTROLS_NestedForm] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [TestSchema].[CONTROLS_NestedGrid]    Script Date: 22/07/2015 01:00:26 p.m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [TestSchema].[CONTROLS_NestedGrid](
	[Id] [int] NOT NULL,
	[TextLimit255] [nvarchar](255) NULL,
 CONSTRAINT [PK_CONTROLS_NestedGrid] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
ALTER TABLE [TestSchema].[CONTROLS_NestedGrid]  WITH CHECK ADD  CONSTRAINT [FK_CONTROLS_NestedGrid_CONTROLS_NestedForm] FOREIGN KEY([Id])
REFERENCES [TestSchema].[CONTROLS_NestedForm] ([Id])
GO
ALTER TABLE [TestSchema].[CONTROLS_NestedGrid] CHECK CONSTRAINT [FK_CONTROLS_NestedGrid_CONTROLS_NestedForm]
GO
EXEC sys.sp_addextendedproperty @name=N'${table}[@controlType="gridView"]/${column}/@mode', @value=N'inherit' , @level0type=N'SCHEMA',@level0name=N'TestSchema', @level1type=N'TABLE',@level1name=N'CONTROLS_NestedForm', @level2type=N'COLUMN',@level2name=N'TextLimit10Chars'
GO
EXEC sys.sp_addextendedproperty @name=N'@mode', @value=N'inherit' , @level0type=N'SCHEMA',@level0name=N'TestSchema', @level1type=N'TABLE',@level1name=N'CONTROLS_NestedGrid', @level2type=N'COLUMN',@level2name=N'TextLimit255'
GO
EXEC sys.sp_addextendedproperty @name=N'scaffold', @value=N'true' , @level0type=N'SCHEMA',@level0name=N'TestSchema', @level1type=N'TABLE',@level1name=N'CONTROLS_NestedGrid', @level2type=N'COLUMN',@level2name=N'TextLimit255'
GO
EXEC sys.sp_addextendedproperty @name=N'[CONTROLS_Grid]@mode', @value=N'inherit' , @level0type=N'SCHEMA',@level0name=N'TestSchema', @level1type=N'TABLE',@level1name=N'CONTROLS_NestedGrid'
GO
EXEC sys.sp_addextendedproperty @name=N'[CONTROLS_Grid]scaffold', @value=N'true' , @level0type=N'SCHEMA',@level0name=N'TestSchema', @level1type=N'TABLE',@level1name=N'CONTROLS_NestedGrid'
GO

/****** Object:  Table [TestSchema].[CONTROLS_Advanced]    Script Date: 10/6/2015 10:48:10 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [TestSchema].[CONTROLS_Advanced](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[EMail] [px].[email] NULL,
	[Px.File] [px].[file] NULL,
	[Px.Picture] [px].[picture] NULL,
	[Px.Password] [px].[password] NULL,
	[Color] [px].[color] NULL,
 CONSTRAINT [PK_CONTROLS_Advanced] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [TestSchema].[CONTROLS_Profiles]    Script Date: 10/6/2015 10:48:10 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [TestSchema].[CONTROLS_Profiles](
	[IdControl] [int] NOT NULL,
	[IdProfile] [int] NOT NULL,
 CONSTRAINT [PK_CONTROLS_Profiles] PRIMARY KEY CLUSTERED 
(
	[IdControl] ASC,
	[IdProfile] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [TestSchema].[Profiles]    Script Date: 10/6/2015 10:48:10 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [TestSchema].[Profiles](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](255) NOT NULL,
	[Abbv] [nvarchar](10) NULL,
 CONSTRAINT [PK_Profiles] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
ALTER TABLE [TestSchema].[CONTROLS_Profiles]  WITH CHECK ADD  CONSTRAINT [FK_CONTROLS_Profiles_CONTROLS_Advanced] FOREIGN KEY([IdControl])
REFERENCES [TestSchema].[CONTROLS_Advanced] ([Id])
GO
ALTER TABLE [TestSchema].[CONTROLS_Profiles] CHECK CONSTRAINT [FK_CONTROLS_Profiles_CONTROLS_Advanced]
GO
ALTER TABLE [TestSchema].[CONTROLS_Profiles]  WITH CHECK ADD  CONSTRAINT [FK_CONTROLS_Profiles_Profiles] FOREIGN KEY([IdProfile])
REFERENCES [TestSchema].[Profiles] ([Id])
GO
ALTER TABLE [TestSchema].[CONTROLS_Profiles] CHECK CONSTRAINT [FK_CONTROLS_Profiles_Profiles]
GO
EXEC sys.sp_addextendedproperty @name=N'@moveBefore', @value=N'Px.File' , @level0type=N'SCHEMA',@level0name=N'TestSchema', @level1type=N'TABLE',@level1name=N'CONTROLS_Advanced', @level2type=N'COLUMN',@level2name=N'Color'
GO
EXEC sys.sp_addextendedproperty @name=N'[CONTROLS_Profiles]@headerText', @value=N'Profiles (Junction Table)' , @level0type=N'SCHEMA',@level0name=N'TestSchema', @level1type=N'TABLE',@level1name=N'CONTROLS_Advanced'
GO
EXEC sys.sp_addextendedproperty @name=N'[CONTROLS_Profiles]scaffold', @value=N'true' , @level0type=N'SCHEMA',@level0name=N'TestSchema', @level1type=N'TABLE',@level1name=N'CONTROLS_Advanced'
GO

SET IDENTITY_INSERT [TestSchema].[Profiles] ON 
GO
INSERT [TestSchema].[Profiles] ([Id], [Name], [Abbv]) VALUES (1, N'Chief Technology Officer', N'CTO')
GO
INSERT [TestSchema].[Profiles] ([Id], [Name], [Abbv]) VALUES (2, N'Project Manager', N'PM')
GO
INSERT [TestSchema].[Profiles] ([Id], [Name], [Abbv]) VALUES (3, N'Business Analyst', N'BA')
GO
INSERT [TestSchema].[Profiles] ([Id], [Name], [Abbv]) VALUES (4, N'Data Modeller', N'DM')
GO
INSERT [TestSchema].[Profiles] ([Id], [Name], [Abbv]) VALUES (5, N'Database Administrator', N'DBA')
GO
INSERT [TestSchema].[Profiles] ([Id], [Name], [Abbv]) VALUES (6, N'Backend Programmer', N'BE')
GO
INSERT [TestSchema].[Profiles] ([Id], [Name], [Abbv]) VALUES (7, N'Frontend Programmer', N'FE')
GO
SET IDENTITY_INSERT [TestSchema].[Profiles] OFF
GO
