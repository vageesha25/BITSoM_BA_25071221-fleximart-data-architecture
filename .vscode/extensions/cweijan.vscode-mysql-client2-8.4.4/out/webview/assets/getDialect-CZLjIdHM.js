import{S as u}from"./stringBuilder-DUZQE8vS.js";import{g as L,c as N,a as H,i as y}from"./wrapper-BXvM5gqA.js";import{D as T}from"./DatabaseType-BbdbLm9P.js";class i{dropDatabase(e){return`DROP DATABASE ${e}`}truncateDatabase(e){return null}pingDataBase(e,a){return null}showMaterialViews(e,a){return""}showExternalTables(e){return`select foreign_table_name "name",foreign_server_name "server",foreign_server_catalog "server_db" from information_schema.foreign_tables where foreign_table_schema='${e}';`}showTableSource(e,a){return null}showIndex(e,a){return null}showForeignKeys(e,a){return null}showChecks(e,a){return null}showPartitions(e,a){return null}showActualPartitions(e,a){return null}showTriggers(e,a){return null}updateTable(e){return null}tableTemplate(e){return null}showViewSource(e,a,t){return null}viewTemplate(e){return null}materializedViewTemplate(){return this.viewTemplate(!0)}updateColumn(e,a){return null}updateColumnSql(e){return null}createIndex(e){return null}dropIndex(e,a){return null}triggerTemplate(e){return`CREATE TRIGGER trigger_name$1
[BEFORE/AFTER] INSERT ON ${e??"[table_name]$2"}
FOR EACH ROW BEGIN
    $3
END;`}dropTriggerTemplate(e,a){return`DROP TRIGGER ${e}`}showTriggerSource(e,a){return null}showEvents(e){return`SELECT EVENT_NAME "name" FROM information_schema.EVENTS where EVENT_SCHEMA='${e}' ORDER BY EVENT_NAME;`}eventTemplate(){return`CREATE EVENT event_name$1
ON SCHEDULE AT CURRENT_TIMESTAMP + INTERVAL 1 HOUR
DO
BEGIN
    SELECT now()$2;
END;`}dropEventTemplate(e){return`DROP EVENT IF EXISTS ${e};`}showProcedures(e){return null}showProcedureSource(e,a){return null}procedureTemplate(){return null}showFunctions(e){return null}showFunctionSource(e,a,t){return null}functionTemplate(){return null}showSequences(e){return null}showCustomTypes(e){return null}showPackages(e){return null}showUsers(){return null}showDatabaseUsers(){return null}createUser(){return null}updateUser(e){return null}dropUser(e){return null}showRoles(){return null}showDatabaseRoles(){return null}createRole(){return null}updateRole(e){return null}dropRole(e){return`DROP ROLE ${e}`}grantRole(e){return null}showLogins(){return null}createLogin(){return null}updateLogin(e){return null}dropLogin(e){return null}showVersion(){return null}showCollations(){return null}showAllComments(){return null}showAllForeignKeys(){return null}showAllConstraints(){return null}kill(e){return null}processList(){return null}variableList(){return null}statusList(){return null}}class P extends i{showVersion(){return"select version() server_version"}createIndex(e){const a=e.indexType||"btree";return`CREATE INDEX ${e.column}_${new Date().getTime()}_index ON ${e.table} USING ${a} (${e.column})`}dropIndex(e,a){return`DROP INDEX ${a}`}showIndex(e,a){return`select name index_name,is_in_sorting_key indexdef  FROM system.columns WHERE database = '${e}' and table ='${a}' and indexdef=1`}variableList(){return"select name , value as setting,description from system.settings s "}statusList(){return"select name as db , engine as status from system.databases d "}kill(e){return`KILL QUERY WHERE query_id='${e.ID}'`}processList(){return`
    SELECT query_id AS "ID", user AS "User",
    current_database AS "DB",os_user AS "State",
    addSeconds(now(), elapsed) AS "Time",
    query AS "SQL"
    FROM system.processes p 
    ORDER BY elapsed desc`}addColumn(e,a){return`ALTER TABLE ${e} 
    ADD COLUMN [column] [type]`}createUser(){return"CREATE USER [name] WITH PASSWORD 'password'"}updateColumn(e,a){const{name:t,type:n,comment:E,nullable:r,defaultValue:s}=a;return`-- change column type
ALTER TABLE ${e} 
    ALTER COLUMN ${t} TYPE ${n};
-- change column name
ALTER TABLE ${e}  
    RENAME COLUMN ${t} TO [newColumnName]`}updateColumnSql(e){const{columnName:a,columnType:t,newColumnName:n,comment:E,table:r,defaultValue:s,oldRow:o}=e;return new u("",`
`).if(t!=o.type,`ALTER TABLE ${r} ALTER COLUMN ${a} TYPE ${t};`).if(s&&s!=o.defaultValue,`ALTER TABLE ${r} MODIFY COLUMN ${a} DEFAULT ${L(s,t)};`).if(E&&E!=o.comment,`ALTER TABLE ${r} MODIFY COLUMN ${a} COMMENT '${E}';`).if(a!=n,`ALTER TABLE ${r} RENAME COLUMN ${a} TO ${n};`).toString()}showUsers(){return"SELECT * FROM system.users"}updateTable(e){const{table:a,newTableName:t,comment:n,newComment:E}=e;let r="";return E&&E!=n&&(r=`ALTER TABLE ${a} MODIFY COMMENT '${E}';`),t&&a!=t&&(r+=`ALTER TABLE ${a} RENAME TO ${t};`),r}truncateDatabase(e){return`SELECT Concat('TRUNCATE TABLE "',TABLE_NAME, '";') trun FROM INFORMATION_SCHEMA.TABLES WHERE  table_schema ='${e}' AND table_type='BASE TABLE';`}createDatabase(e){return"CREATE DATABASE $1"}showTableSource(e,a){return`SELECT create_table_query as "Create Table",name as table_name,'definition' as view_definition from system.tables WHERE database='${e}' and name='${a}'`}showViewSource(e,a){return`SELECT create_table_query as "Create View",name as table_name,'definition' as view_definition from system.tables WHERE database='${e}' and name='${a}'`}showProcedureSource(e,a){return"select number from system.numbers where 1=0"}showFunctionSource(e,a){return"select number from system.numbers where 1=0"}showTriggerSource(e,a){return"select number from system.numbers where 1=0"}showColumns(e,a){return`select name,type, null as maximum_length,default_expression as defaultValue,is_in_primary_key as key from system.columns c where database='${e}' and table='${a}' `}showProcedures(e){return"select number from system.numbers where 1=0"}showViews(e){return`select name ,engine as type from system.tables where database='${e}' and engine = 'View' ORDER BY name`}buildPageSql(e,a,t){return`SELECT * FROM ${a} LIMIT ${t}`}showTables(e){return`select name, engine as type from system.tables where database='${e}' and engine <> 'View' ORDER BY name`}showDatabases(){return"SELECT name as Database FROM system.databases where name not in ('information_schema','INFORMATION_SCHEMA') order by name ASC"}showSchemas(){return this.showDatabases()}tableTemplate(){return`CREATE TABLE table_name$1(  
    id UUID,
    create_time DATETIME,
    name$2 String
)
ENGINE = MergeTree()
ORDER BY (id)
PRIMARY KEY(id);`}viewTemplate(){return`CREATE VIEW $1
AS
SELECT * FROM $2`}procedureTemplate(){return"select number from system.numbers where 1=0"}functionTemplate(){return"CREATE FUNCTION [func_name] AS (a, b, c) -> a * b * c;"}showRoles(){return"SELECT name FROM system.roles ORDER BY name;"}createRole(){return`CREATE ROLE role_name$1;
-- Grant role privileges
GRANT role_name$1 TO role_name$2;`}updateRole(e){return`ALTER ROLE ${e} 
-- RENAME TO new_name
;`}grantRole(e){return`GRANT ${e} TO role_name$1;`}}class C{constructor(e){this.param=e,this.afterTablePrefix=`ALTER TABLE "${e.table}"`,this.afterColumnPrefix=`${this.afterTablePrefix} ALTER COLUMN "${e.columnName}"`}genAlterSQL(){const{columnName:e,newColumnName:a}=this.param;return new u("",`
`).append(this.changeTypePart()).append(this.notNullPart()).append(this.defaultPart()).append(this.otherPart()).append(this.commentPart()).if(e!=a,`${this.afterTablePrefix} RENAME COLUMN "${e}" TO "${a}";`).toString()}changeTypePart(){const{oldRow:e,columnType:a}=this.param;return e.type==a?"":`${this.afterColumnPrefix} TYPE ${a};`}notNullPart(){const{oldRow:e,isNotNull:a}=this.param;return e.isNotNull==a?"":`${this.afterColumnPrefix} ${a?"SET NOT NULL":"DROP NOT NULL"};`}otherPart(){return null}defaultPart(){const{oldRow:e,defaultValue:a,columnType:t}=this.param;return e.defaultValue==a?"":`${this.afterColumnPrefix} ${N(a)?"DROP DEFAULT":`SET DEFAULT ${L(a,t)}`};`}commentPart(){return""}}class S extends i{showVersion(){return""}createIndex(e){return`ALTER TABLE ${e.table} ADD ${e.type||"key"} ("${e.column||"[column]"}")`}dropIndex(e,a){return`DROP INDEX "${a}"`}addColumn(e,a){const t=a?` AFTER "${a}"`:"";return`ALTER TABLE ${e}
    ADD COLUMN [column] [type] COMMENT ''${t};`}createUser(){return`CREATE USER 'username'@'%' IDENTIFIED BY 'password';
-- Grant select privilege to all databases;
GRANT SELECT ON *.* TO 'username'@'%' WITH GRANT OPTION;
-- Grant all privileges to all databases;
GRANT ALL PRIVILEGES ON *.* TO 'username'@'%' WITH GRANT OPTION;`}updateUser(e){return`update mysql.user set
    password = PASSWORD("newPassword")
    where User = '${e}';
FLUSH PRIVILEGES;
-- since mysql version 5.7, password column need change to authentication_string=PASSWORD("newPassword")
`}updateColumn(e,a){const{name:t,type:n,comment:E,nullable:r,defaultValue:s,extra:o,character_set_name:c,collation_name:_}=a;return new u(`ALTER TABLE ${e}`).append(`
	CHANGE ${t} ${t} ${n}`).if(c,`CHARACTER SET ${c}`).if(_,`COLLATE ${_}`).if(r!="YES","NOT NULL").if(o?.toLowerCase()?.includes("auto_increment"),"AUTO_INCREMENT").if(E,`COMMENT '${E}'`).if(s,`DEFAULT ${s=="CURRENT_TIMESTAMP"?s:`'${s}'`}`).toString()}updateColumnSql(e){return new C(e).genAlterSQL()}updateTable(e){const{table:a,newTableName:t,comment:n,newComment:E}=e;let r="";return E&&E!=n&&(r=`COMMENT ON TABLE "${a}" IS '${E}';`),t&&a!=t&&(r+=`RENAME TABLE "${a}" TO "${t}";`),r}truncateDatabase(e){return`SELECT Concat('TRUNCATE TABLE "',table_schema,'"."',TABLE_NAME, '";') trun FROM INFORMATION_SCHEMA.TABLES where  table_schema ='${e}' and TABLE_TYPE<>'VIEW';`}createDatabase(e){return"CREATE DATABASE $1;"}showTableSource(e,a){return`SHOW CREATE TABLE ${e}.${a};`}showViewSource(e,a,t){return`SHOW CREATE VIEW database.${a};`}showColumns(e,a){return`SELECT COLUMN_NAME name,DATA_TYPE type, IS_NULLABLE nullable
            FROM information_schema.columns WHERE table_schema = '${e}' AND table_name = '${a}' ORDER BY ORDINAL_POSITION;`}buildPageSql(e,a,t){return`SELECT * FROM ${a} LIMIT ${t};`}showTables(e,a=e){return`SELECT TABLE_NAME "name" FROM information_schema.TABLES  WHERE TABLE_SCHEMA = '${a}' and TABLE_TYPE<>'VIEW' ORDER BY TABLE_NAME;`}showViews(e,a=e){return`SELECT TABLE_NAME name FROM information_schema.VIEWS  WHERE TABLE_SCHEMA = '${a}' ORDER BY TABLE_NAME`}showDatabases(){return"SELECT SCHEMA_NAME as Database FROM information_schema.schemata ORDER BY Database;"}showSchemas(e){return"SELECT SCHEMA_NAME as schema FROM information_schema.schemata ORDER BY schema;"}tableTemplate(e){return`CREATE TABLE table_name$1(
    id int,
    create_time DATE,
    update_time DATE,
    content VARCHAR(255)
);`}viewTemplate(){return`CREATE VIEW view_name$1
AS
SELECT * FROM `}procedureTemplate(){return`CREATE PROCEDURE procedure_name$1()
BEGIN
    $2
END;`}functionTemplate(){return`CREATE FUNCTION function_name$1() RETURNS int
BEGIN
    $2
    return 0;
END;`}}class g extends i{showDatabases(){return null}showSchemas(e){return null}showTables(e,a,t){return null}addColumn(e,a){return null}showColumns(e,a,t){return null}showViews(e,a){return null}buildPageSql(e,a,t){return null}createDatabase(e){return null}}class U extends i{showVersion(){return`select RTRIM(SUBSTR(REPLACE(banner,'Oracle Database ',''),1,3)) "server_version" from v$version where rownum=1`}showAllForeignKeys(){return`SELECT 
    a.constraint_name AS "constraint_name",
    a.owner AS "table_schema",
    a.table_name AS "table_name",
    a.column_name AS "column_name",
    c.owner AS "referenced_schema",
    c.table_name AS "referenced_table",
    c.column_name AS "referenced_column"
FROM 
    ALL_CONS_COLUMNS a 
JOIN 
    ALL_CONSTRAINTS b ON a.owner = b.owner AND a.constraint_name = b.constraint_name
JOIN 
    ALL_CONS_COLUMNS c ON b.r_owner = c.owner AND b.r_constraint_name = c.constraint_name
WHERE 
    b.constraint_type = 'R'
    and a.owner not in ('SYS','APEX_040200')`}showAllConstraints(){return`SELECT 
        b.CONSTRAINT_NAME "constraint_name",
        c.CONSTRAINT_TYPE "constraint_type",
        b.owner "table_schema",
        b.table_name "table_name",
        b.COLUMN_NAME "column_name"
         FROM ALL_CONS_COLUMNS b 
          join ALL_CONSTRAINTS c on b.CONSTRAINT_NAME=c.CONSTRAINT_NAME 
          WHERE CONSTRAINT_TYPE='P'
          and b.owner not in ('SYS','APEX_040200')`}showAllComments(){return`SELECT 
        owner "table_schema",
        table_name "table_name",
        COLUMN_NAME "column_name",
        COMMENTS "comment"
         FROM all_col_comments WHERE COMMENTS is not null
         and owner not in ('SYS','APEX_040200')`}createIndex(e){const{table:a,column:t}=e;return`CREATE INDEX ${`${a}_${t}`} ON ${a}(${t})`}dropIndex(e,a){return`DROP INDEX ${a}`}showIndex(e,a){return`SELECT 
col.COLUMN_NAME "column_name",col.INDEX_NAME "index_name",idx.UNIQUENESS "uniqueness"
from ALL_IND_COLUMNS col
join ALL_INDEXES idx on col.index_name = idx.index_name
WHERE col.TABLE_OWNER='${e}'
     and col.TABLE_NAME='${a}';`}variableList(){return"SELECT name, value FROM V$PARAMETER"}kill(e){const{SID:a,SERIAL:t}=e;return`ALTER SYSTEM KILL SESSION '${a},${t}' IMMEDIATE;`}processList(){return`SELECT 
        SID, SERIAL# as SERIAL,
        s.username "User", s.schemaname "Schema", 
        s.status "Status", 
        sql.sql_text SQL
        FROM v$session s,
             v$sql     sql
       WHERE sql.sql_id(+) = s.sql_id
         AND s.type     = 'USER'`}addColumn(e,a){return`ALTER TABLE ${e} 
    ADD [column] [type];
COMMENT ON COLUMN ${e}.[column] IS 'comment'`}createUser(){return`CREATE USER $1 IDENTIFIED BY [password$2];
GRANT CONNECT TO $1;
ALTER USER $1 quota unlimited on USERS;
        `}updateUser(e){return`ALTER USER ${e} IDENTIFIED BY [new_password]`}updateColumn(e,a){const{name:t,type:n,comment:E,nullable:r,defaultValue:s}=a;return`-- change column type
ALTER TABLE ${e} MODIFY ${t} ${n};
-- change column name
ALTER TABLE ${e} RENAME COLUMN ${t} TO [newColumnName];
COMMENT ON COLUMN ${e}.${t} IS '${E||""}'`}updateColumnSql(e){const{columnName:a,columnType:t,newColumnName:n,comment:E,defaultValue:r,table:s,isNotNull:o,oldRow:c}=e;return new u("","").if(t!=c.type,`ALTER TABLE "${s}" MODIFY "${a}" ${t};`).if(o!=c.isNotNull,`
ALTER TABLE "${s}" MODIFY "${a}"${o?"NOT NULL":"NULL"};`).if(r!=null&&r!=c.defaultValue,`
ALTER TABLE "${s}" MODIFY "${a}" DEFAULT ${r?.match(/(:|nextval)/i)?r:`'${r?.replace(/(^'|'$)/g,"")}'`};`).if(E&&E!=c.comment,`
COMMENT ON COLUMN "${s}"."${a}" is '${E}';`).if(a!=n,`
ALTER TABLE "${s}" RENAME COLUMN "${a}" TO "${n}";`).toString()}showUsers(){return'SELECT username "user" FROM all_users'}pingDataBase(e){return e?`ALTER SESSION SET current_schema = "${e}"`:null}updateTable(e){const{table:a,newTableName:t,comment:n,newComment:E}=e;let r="";return E&&E!=n&&(r=`COMMENT ON TABLE "${a}" IS '${E}';`),t&&a!=t&&(r+=`ALTER TABLE "${a}" RENAME TO "${t}"`),r}truncateDatabase(e){return`SELECT 'TRUNCATE TABLE "' || owner || '"."' || object_name || '";' trun FROM all_objects where  owner ='${e}' and object_type ='TABLE'`}createDatabase(e){return"CREATE USER $1 IDENTIFIED BY password$2;"}showViewSource(e,a,t){return t?`select QUERY "Create View" from ALL_MVIEWS where OWNER='${e}' and mview_name='${a}'`:`SELECT DBMS_METADATA.GET_DDL('VIEW', '${a}', '${e}') AS VIEW_DDL FROM DUAL;`}showProcedureSource(e,a){return`SELECT text "Create Procedure"
        FROM all_source
       WHERE owner = '${e}'
         AND name  = '${a}'
       ORDER BY line`}showFunctionSource(e,a){return`SELECT 'CREATE ' || LISTAGG(text) within group( order by line ) "source"
        FROM all_source
       WHERE owner = '${e}'
         AND name  = '${a}'
       ORDER BY line`}showTriggerSource(e,a){return`SELECT text
        FROM all_source
       WHERE owner = '${e}'
         AND name  = '${a}'
       ORDER BY line`}showColumns(e,a){return e?`select
        a.COLUMN_NAME "name",
        a.DATA_DEFAULT "defaultValue",
        a.DATA_PRECISION "precision",
        a.DATA_SCALE "scale",
        a.DATA_TYPE "type",
        COALESCE(a.DATA_PRECISION, a.data_length) "maximum_length",
        a.NULLABLE "nullable"
      from
        all_tab_columns a
      where
        a.owner = '${e}'
        and a.table_name = '${a}'`:`select
a.COLUMN_NAME "name",
a.DATA_DEFAULT "defaultValue",
a.DATA_PRECISION "precision",
a.DATA_SCALE "scale",
a.DATA_TYPE "type",
COALESCE(a.DATA_PRECISION, a.data_length) "maximum_length",
a.NULLABLE "nullable"
from
    user_tab_columns a
where
a.table_name = '${a}'`}showChecks(e,a){return`SELECT
        c.constraint_name "name",
        c.search_condition "clause"
    FROM
        all_constraints c
    WHERE
        c.owner = '${e}' and
        c.table_name = '${a}'
        AND c.constraint_type = 'C';`}showForeignKeys(e,a){let t=`select
        b.CONSTRAINT_NAME "constraint_name",
        b.COLUMN_NAME "column_name",
        c_pk.table_name "referenced_table",
        b_pk.COLUMN_NAME "referenced_column"
    from ALL_CONS_COLUMNS b
        join ALL_CONSTRAINTS c on b.owner=c.owner and b.CONSTRAINT_NAME = c.CONSTRAINT_NAME
        JOIN all_constraints c_pk ON c.r_owner = c_pk.owner AND c.r_constraint_name = c_pk.constraint_name
        join ALL_CONS_COLUMNS b_pk on b_pk.CONSTRAINT_NAME = c_pk.CONSTRAINT_NAME
    where
        b.owner = '${e}' and
        b.table_name = '${a}'
        and c.CONSTRAINT_TYPE = 'R';`;return e||(t=t.replace(/all_/ig,"USER_").replace("b.owner = 'undefined' and","")),t}showTriggers(e,a){const t=a?` AND TABLE_NAME='${a}'`:"";return`SELECT TRIGGER_NAME "trigger_name",TABLE_NAME "table_name",TRIGGERING_EVENT "event" FROM all_triggers WHERE TABLE_OWNER='${e}' ${t} ORDER BY TRIGGER_NAME`}showPackages(e){return`SELECT 
                    object_name "name" ,
                    status "status"
                FROM 
                    ALL_OBJECTS 
                WHERE 
                    OBJECT_TYPE IN ('PACKAGE') 
                    AND owner='${e}' 
                ORDER BY 
                    "name"`}showProcedures(e){return`SELECT 
                    object_name "ROUTINE_NAME" ,
                    status "status"
                FROM 
                    all_objects 
                WHERE 
                    object_type = 'PROCEDURE' 
                    AND owner = '${e}' 
                ORDER BY 
                    "ROUTINE_NAME"`}showFunctions(e){return`SELECT 
                    object_name "ROUTINE_NAME" ,
                    status "status"
                FROM 
                    all_objects 
                WHERE 
                    object_type = 'FUNCTION' 
                    AND owner='${e}' 
                ORDER BY 
                    "ROUTINE_NAME"`}showViews(e,a){return`select object_type "type",object_name "name" from all_objects where object_type = 'VIEW' and owner='${a}' ORDER BY "type","name"`}showMaterialViews(e,a){return`select object_type "type",object_name "name" from all_objects where object_type = 'MATERIALIZED VIEW' and owner='${a}' ORDER BY "type","name"`}buildPageSql(e,a,t){return`SELECT * FROM ${a} WHERE ROWNUM <= ${t}`}showTables(e,a){return`select 
        o.object_name "name", nvl(t.num_rows, -1) "table_rows", 
        c.comments "comment", s.bytes "data_length"
        from all_objects o
        LEFT JOIN all_tables t on o.owner = t.owner and o.object_name = t.table_name
        LEFT JOIN all_tab_comments c on o.owner = c.owner and o.object_name = c.table_name
        LEFT JOIN USER_SEGMENTS s on o.object_name = s.segment_name
        where o.owner = '${a}' and o.object_type = 'TABLE' ORDER BY "name"`}showDatabases(){return'select username as "Database" from sys.all_users order by username'}showSchemas(){return'select username as "Database" from sys.all_users order by username'}tableTemplate(){return`CREATE TABLE table_name$1(  
    id NUMBER GENERATED AS IDENTITY PRIMARY KEY,
    create_time DATE,
    name$2 VARCHAR2(255)
);
COMMENT ON TABLE table_name$1 IS '$3';
COMMENT ON COLUMN table_name$1.$2 IS '$4'`}viewTemplate(e){return`CREATE ${e?"MATERIALIZED ":""}VIEW view_name$1
AS
SELECT * FROM $2`}procedureTemplate(){return`CREATE PROCEDURE proc_name$1(x IN OUT NUMBER, y OUT NUMBER)
IS
BEGIN
   $2
   y:=4 * x;
END;`}functionTemplate(){return`CREATE FUNCTION fun_name$1(x IN NUMBER) 
RETURN NUMBER 
IS
BEGIN 
    $2
    RETURN x*2;
END;`}showRoles(){return"SELECT role as name FROM dba_roles ORDER BY role;"}createRole(){return`CREATE ROLE role_name$1;
-- Grant role privileges
GRANT role_name$1 TO role_name$2;`}updateRole(e){return`ALTER ROLE ${e} 
-- NOT IDENTIFIED
-- IDENTIFIED BY password
-- IDENTIFIED EXTERNALLY
-- IDENTIFIED GLOBALLY
;`}grantRole(e){return`GRANT ${e} TO role_name$1;`}}class Y extends U{showVersion(){return`SELECT REPLACE(banner,'DM Database Server 64 ','') "server_version"  FROM v$version where rownum=1;`}createIndex(e){const{table:a,column:t="$2"}=e;return`CREATE INDEX ${`${a}_${t}`} ON ${a}(${t});`}dropIndex(e,a){return`DROP INDEX ${a};`}showIndex(e,a){return`SELECT COLUMN_NAME "column_name",INDEX_NAME "index_name" from all_IND_COLUMNS WHERE TABLE_OWNER='${e}' and TABLE_NAME='${a}';`}processList(){return"SELECT SESS_ID,STATE,SQL_TEXT FROM v$sessions"}addColumn(e,a){return`ALTER TABLE ${e} 
    ADD COLUMN $1 $2;
COMMENT ON COLUMN ${e}.$3 IS 'comment$4';`}createUser(){return"CREATE USER $1 IDENTIFIED BY [password]$2;"}updateUser(e){return`ALTER USER ${e} IDENTIFIED BY [new_password];`}updateColumn(e,a){const{name:t,type:n,comment:E,nullable:r,defaultValue:s}=a;return`-- change column type
ALTER TABLE ${e} MODIFY ${t} ${n};
-- change column name
ALTER TABLE ${e} RENAME COLUMN ${t} TO [newColumnName];
COMMENT ON COLUMN ${e}.${t} IS '${E||""}';`}updateColumnSql(e){const{columnName:a,columnType:t,newColumnName:n,comment:E,defaultValue:r,table:s,isNotNull:o,oldRow:c}=e;return new u("","").if(t!=c.type,`ALTER TABLE "${s}" MODIFY "${a}" ${t};`).if(o!=c.isNotNull,`
ALTER TABLE "${s}" MODIFY "${a}"${o?"NOT NULL":"NULL"};`).if(r!=null&&r!=c.defaultValue,`
ALTER TABLE "${s}" MODIFY "${a}" DEFAULT ${r?.match(/(:|nextval)/i)?r:`'${r?.replace(/(^'|'$)/g,"")}'`};`).if(E&&E!=c.comment,`
COMMENT ON COLUMN "${s}"."${a}" is '${E}';`).if(a!=n,`
ALTER TABLE "${s}" RENAME COLUMN "${a}" TO "${n}";`).toString()}showUsers(){return'SELECT username "user" FROM all_users'}pingDataBase(e){return e?`set SCHEMA ${e}`:null}updateTable(e){const{table:a,newTableName:t,comment:n,newComment:E}=e;let r="";return E&&E!=n&&(r=`COMMENT ON TABLE "${a}" IS '${E}';`),t&&a!=t&&(r+=`ALTER TABLE "${a}" RENAME TO "${t}"`),r}truncateDatabase(e){return`SELECT Concat('TRUNCATE TABLE \`',table_schema,'\`.\`',TABLE_NAME, '\`;') trun FROM INFORMATION_SCHEMA.TABLES where  table_schema ='${e}' and TABLE_TYPE<>'VIEW';`}createDatabase(e){return"CREATE USER [name] IDENTIFIED BY [password];"}showViewSource(e,a){return`CALL SP_VIEWDEF('${e}', '${a}');`}showProcedureSource(e,a){return`SELECT LISTAGG(text) within group(order by line) "Create Procedure"
        FROM all_source
       WHERE owner = '${e}'
         AND name  = '${a}'
       ORDER BY line`}showFunctionSource(e,a){return`select DBMS_METADATA.GET_DDL('FUNCTION', '${a}','${e}') "Create Function";`}showColumns(e,a){return`select
        a.COLUMN_NAME "name",
        a.DATA_DEFAULT "defaultValue",
        a.DATA_TYPE "type",
        a.DATA_PRECISION "precision",
        a.DATA_SCALE "scale",
        a.data_length "maximum_length",
        a.NULLABLE "nullable",
        c.CONSTRAINT_TYPE "key",
        cc.COMMENTS "comment",
        sc."INFO2" "extra"
      from
        all_tab_columns a
        left join all_col_comments cc on a.COLUMN_NAME=cc.COLUMN_NAME and a.OWNER=cc.SCHEMA_NAME and a.table_name=cc.table_name
        left join ALL_CONS_COLUMNS b on a.COLUMN_NAME=b.COLUMN_NAME and a.OWNER=b.OWNER and a.table_name=b.table_name
        left join all_CONSTRAINTS c on b.CONSTRAINT_NAME=c.CONSTRAINT_NAME
        left join sys.syscolumns sc on sc.id = (
            SELECT OBJECT_ID
                FROM all_objects t
                WHERE t.owner =a.OWNER
                AND t.object_name = a.table_name
                AND t.OBJECT_TYPE='TABLE'
        ) and sc."NAME"=a.COLUMN_NAME
      where
        a.owner = '${e}'
        and a.table_name = '${a}';`}showProcedures(e){return`select object_name "ROUTINE_NAME" from all_objects where object_type = 'PROCEDURE' and owner='${e}' ORDER BY "ROUTINE_NAME";`}showFunctions(e){return`select object_name "ROUTINE_NAME" from all_objects where object_type = 'FUNCTION' and owner='${e}' ORDER BY "ROUTINE_NAME";`}showViews(e){return`select object_name "name" from all_objects where object_type = 'VIEW' and owner='${e}';`}buildPageSql(e,a,t){return`SELECT * FROM ${a} LIMIT ${t};`}kill(e){return`sp_close_session('${e.SESS_ID}');`}showTables(e,a){return`SELECT a.object_name "name",b.COMMENTS "comment"
FROM all_objects a
LEFT JOIN ALL_TAB_COMMENTS b on a.OWNER=b.OWNER and a.object_name=b.TABLE_NAME
where a.object_type = 'TABLE' and a.owner='${a}' and a.TEMPORARY<>'Y';`}showDatabases(){return`select object_name "Database" from all_objects where object_type = 'SCH';`}showSchemas(){return`select object_name "Database" from all_objects where object_type = 'SCH';`}tableTemplate(){return`CREATE TABLE table_name$1(  
    id int NOT NULL PRIMARY KEY IDENTITY(1,1),
    create_time DATETIME,
    name$2 VARCHAR(255)
);
COMMENT ON TABLE $1 IS '$3';
COMMENT ON COLUMN $1.$2 IS '$4';`}viewTemplate(){return`CREATE VIEW view_name$1
AS
SELECT * FROM $2`}procedureTemplate(){return`CREATE PROCEDURE proc_name$1(x IN OUT NUMBER, y OUT NUMBER)
IS
BEGIN
   $2
   y:=4 * x;
END;`}functionTemplate(){return`CREATE FUNCTION fun_name$1(x IN int) RETURN int$2
AS
BEGIN
    $3
    return x*2;
END;`}}class M extends i{showVersion(){return"select @@version server_version;"}showAllForeignKeys(){return`SELECT 
        CONSTRAINT_NAME constraint_name,
        TABLE_SCHEMA table_schema,
        TABLE_NAME table_name,
        COLUMN_NAME column_name,
        REFERENCED_TABLE_SCHEMA referenced_schema,
        REFERENCED_TABLE_NAME referenced_table,
        REFERENCED_COLUMN_NAME referenced_column
         FROM information_schema.KEY_COLUMN_USAGE 
         WHERE REFERENCED_TABLE_NAME is not null`}createIndex(e){let a=`${e.type||"key"}`;return a.match(/BTREE/i)&&(a="key"),`ALTER TABLE ${e.table} ADD ${a} (\`${e.column||"$1"}\`)`}dropIndex(e,a){return`ALTER TABLE ${e} DROP INDEX \`${a}\``}showIndex(e,a){return`SELECT column_name "column_name",index_name "index_name",index_type "index_type",non_unique=0 "isUnique" FROM INFORMATION_SCHEMA.STATISTICS WHERE table_schema='${e}' and table_name='${a}'
        ORDER BY index_name, SEQ_IN_INDEX;`}variableList(){return"show global VARIABLES"}statusList(){return"show global status"}kill(e){return`KILL ${e?.ID};`}processList(){return"SELECT ID, USER User, DB, COMMAND Command, STATE State, TIME Time, INFO `SQL`\nFROM information_schema.PROCESSLIST;"}addColumn(e,a){const t=a?` AFTER \`${a}\``:"";return`ALTER TABLE ${e} 
    ADD COLUMN $1 [type]$2 COMMENT '$3'${t};`}createUser(){return`CREATE USER '$1'@'%' IDENTIFIED BY 'password$2';
-- Grant select privilege to all databases;
GRANT SELECT ON *.* TO '$1'@'%' WITH GRANT OPTION;
-- Grant all privileges to all databases;
GRANT ALL PRIVILEGES ON *.* TO '$1'@'%' WITH GRANT OPTION;`}updateUser(e){return`update mysql.user set 
    password = PASSWORD("newPassword")
    where User = '${e}';
FLUSH PRIVILEGES;
-- since mysql version 5.7, password column need change to authentication_string=PASSWORD("newPassword")
`}updateColumn(e,a){const{nullable:t,extra:n}=a;return this.updateColumnSql({table:e,...a,isNotNull:t!="YES",isAutoIncrement:n?.toLowerCase()?.includes?.("auto_increment")})}updateColumnSql(e){const{table:a,tableMeta:t,name:n,columnName:E=n,type:r,unsigned:s,zerofill:o,useCurrentTimestamp:c,isNotNull:_,isAutoIncrement:A,comment:m,defaultValue:R,generation_expression:O,character_set_name:d,collation_name:I}=e,h=r?.match(/char|text|set|enum|blob|binary/i)&&t?.collation!=I;return new u(`ALTER TABLE \`${a}\``).append(`
	CHANGE \`${E}\` \`${n}\` ${r}`).if(s=="1","UNSIGNED").if(o=="1","ZEROFILL").if(c,"ON UPDATE CURRENT_TIMESTAMP").if(h&&d,`CHARACTER SET ${d}`).if(h&&I,`COLLATE ${I}`).if(_,"NOT NULL").if(A,"AUTO_INCREMENT").if(O,`GENERATED ALWAYS AS ${O} STORED`).condition(!O,F=>F.if(N(R)&&!_,"DEFAULT NULL").if(!N(R),`DEFAULT ${R=="CURRENT_TIMESTAMP"?R:`${L(R,r)}`}`)).if(m,`COMMENT '${m}'`).append(";").toString()}showCollations(){return'select DEFAULT_COLLATE_NAME "name",CHARACTER_SET_NAME "charset",DESCRIPTION "description" from information_schema.CHARACTER_SETS ORDER BY name;'}showChecks(e,a){return`SELECT
        tc.CONSTRAINT_NAME "name",
        cc.CHECK_CLAUSE "clause"
    FROM
        information_schema.CHECK_CONSTRAINTS AS cc,
        information_schema.TABLE_CONSTRAINTS AS tc
    WHERE
        tc.CONSTRAINT_SCHEMA = '${e}'
        AND tc.TABLE_NAME = '${a}'
        AND tc.CONSTRAINT_TYPE = 'CHECK'
        AND tc.CONSTRAINT_SCHEMA = cc.CONSTRAINT_SCHEMA
        AND tc.CONSTRAINT_NAME = cc.CONSTRAINT_NAME;`}showUsers(){return"SELECT user user,host host FROM mysql.user;"}pingDataBase(e){return e?`use \`${e}\``:null}updateTable(e){const{table:a,newTableName:t,comment:n,newComment:E,collation:r,newCollation:s}=e;let o="";return E&&E!=n&&(o=`ALTER TABLE \`${a}\` COMMENT = '${E}';`),s&&s!=r&&(o+=`ALTER TABLE \`${a}\` collate = '${s}';`),t&&a!=t&&(o+=`ALTER TABLE \`${a}\` RENAME TO \`${t}\`;`),o}truncateDatabase(e){return`SELECT Concat('TRUNCATE TABLE \`',table_schema,'\`.\`',TABLE_NAME, '\`;') trun FROM INFORMATION_SCHEMA.TABLES where  table_schema ='${e}' and TABLE_TYPE<>'VIEW';`}createDatabase(e){return`CREATE DATABASE $1
    DEFAULT CHARACTER SET = 'utf8mb4';`}showTableSource(e,a){return`SHOW CREATE TABLE \`${e}\`.\`${a}\`;`}showPartitions(e,a){return`SELECT 
PARTITION_NAME "name",PARTITION_METHOD "strategy",PARTITION_EXPRESSION "columnName",
PARTITION_DESCRIPTION "value",TABLE_ROWS "rows",DATA_LENGTH "length"
        FROM information_schema.partitions WHERE TABLE_SCHEMA='${e}' AND TABLE_NAME = '${a}' AND PARTITION_NAME IS NOT NULL`}showViewSource(e,a){return`SHOW CREATE VIEW  \`${e}\`.\`${a}\`;`}showProcedureSource(e,a){return`SHOW CREATE PROCEDURE \`${e}\`.\`${a}\`;`}showFunctionSource(e,a){return`SHOW CREATE FUNCTION \`${e}\`.\`${a}\`;`}showTriggerSource(e,a){return`SHOW CREATE TRIGGER \`${e}\`.\`${a}\`;`}showColumns(e,a){return`SELECT 
        c.COLUMN_NAME name,
        COLUMN_TYPE type,
        COLUMN_COMMENT comment,COLUMN_KEY \`key\`,IS_NULLABLE nullable,
        CHARACTER_MAXIMUM_LENGTH maximum_length,
        COLUMN_DEFAULT defaultValue,
        INSTR(COLUMN_TYPE,'zerofill')>0 "zerofill",
        INSTR(COLUMN_TYPE,'unsigned')>0 "unsigned",
        EXTRA extra,
        COLLATION_NAME collation_name,
        CHARACTER_SET_NAME character_set_name 
        FROM information_schema.columns c
        WHERE c.table_schema = '${e}' AND c.table_name = '${a}' 
        ORDER BY c.ORDINAL_POSITION;`}showForeignKeys(e,a){return`SELECT
        c.COLUMN_NAME column_name, ik.CONSTRAINT_NAME constraint_name,
        ik.REFERENCED_TABLE_NAME referenced_table, ik.REFERENCED_COLUMN_NAME referenced_column,
        UPDATE_RULE "updateRule",
        DELETE_RULE "deleteRule"
        FROM
        information_schema.columns c join information_schema.KEY_COLUMN_USAGE ik on c.table_schema = ik.TABLE_SCHEMA
        and c.table_name = ik.TABLE_NAME and c.COLUMN_NAME = ik.COLUMN_NAME
        JOIN information_schema.REFERENTIAL_CONSTRAINTS ir on ik.CONSTRAINT_NAME=ir.CONSTRAINT_NAME
        WHERE c.table_schema = '${e}' and c.table_name = '${a}' ORDER BY ik.CONSTRAINT_NAME;`}showTriggers(e,a){const t=a?` AND EVENT_OBJECT_TABLE='${a}'`:"";return`SELECT 
                    EVENT_OBJECT_TABLE table_name,
                    TRIGGER_NAME "trigger_name",
                    ACTION_TIMING timing,
                    EVENT_MANIPULATION event,
                    EVENT_MANIPULATION manipulation,
                    ACTION_ORIENTATION orientation,
                    ACTION_STATEMENT statement
                FROM 
                    information_schema.TRIGGERS 
                WHERE 
                    TRIGGER_SCHEMA = '${e}' 
                    ${t} 
                ORDER BY 
                    TRIGGER_NAME;`}showProcedures(e){return`SELECT 
    r.ROUTINE_NAME "name",
    p.PARAMETER_NAME "param_name",
    p.DATA_TYPE "param_type",
    p.PARAMETER_MODE "param_mode"
FROM 
    information_schema.routines r
LEFT JOIN 
    information_schema.parameters p 
ON 
    r.SPECIFIC_NAME = p.SPECIFIC_NAME
WHERE
    r.ROUTINE_SCHEMA = '${e}'
    AND r.ROUTINE_TYPE = 'PROCEDURE'
ORDER BY 
    r.ROUTINE_NAME, p.ORDINAL_POSITION;`}showFunctions(e){return`SELECT 
        ROUTINE_NAME "name",
        p.PARAMETER_NAME "param_name",
        p.DATA_TYPE "param_type",
        p.PARAMETER_MODE "param_mode"
    FROM 
        information_schema.routines  r
    LEFT JOIN 
        information_schema.parameters p 
    ON 
        r.SPECIFIC_NAME = p.SPECIFIC_NAME
    WHERE 
        r.ROUTINE_SCHEMA = '${e}' 
        AND r.ROUTINE_TYPE = 'FUNCTION' 
    ORDER BY 
        r.ROUTINE_NAME;`}showViews(e){return`SELECT TABLE_NAME name,SECURITY_TYPE "view_group" FROM information_schema.VIEWS  WHERE TABLE_SCHEMA = '${e}' ORDER BY TABLE_NAME`}buildPageSql(e,a,t){return`SELECT * FROM ${a} LIMIT ${t};`}showTables(e){return`SELECT TABLE_COMMENT "comment",TABLE_NAME "name",TABLE_ROWS "table_rows",\`AUTO_INCREMENT\` "auto_increment",
        row_format "row_format",DATA_LENGTH "data_length",INDEX_LENGTH "index_length",TABLE_COLLATION "collation",
        TABLE_TYPE "view_group",\`ENGINE\` engine
        FROM information_schema.TABLES  WHERE TABLE_SCHEMA = '${e}' and TABLE_TYPE<>'VIEW' ORDER BY TABLE_NAME;`}showDatabases(){return"show DATABASES"}showSchemas(){return this.showDatabases()}tableTemplate(){return`CREATE TABLE table_name$1(  
    id int NOT NULL PRIMARY KEY AUTO_INCREMENT COMMENT 'Primary Key',
    create_time DATETIME COMMENT 'Create Time',
    name$2 VARCHAR(255)
) COMMENT '$4';`}viewTemplate(){return`CREATE VIEW view_name$1
AS
SELECT * FROM $2`}procedureTemplate(){return`CREATE PROCEDURE proc_name$1()
BEGIN
$2
END;`}functionTemplate(){return`CREATE FUNCTION fun_name$1() RETURNS int$2
READS SQL DATA
BEGIN
    $3
    return 0;
END;`}}class W extends M{showVersion(){return"select replace(@@version,'-MariaDB','') server_version;"}}class G extends g{showSchemas(e){return null}showVersion(){return"show version"}showDatabases(){return"show dbs"}buildPageSql(e,a,t){return`db('${e}').collection('${a}').find({}).limit(${t}).toArray()`}showIndex(e,a){return`db('${e}').collection('${a}').indexes();`}createIndex(e){const{database:a,table:t,column:n}=e;return`db('${a}').collection('${t}').createIndex({ ${n||"column_name"}: 1 });`}createDatabase(e){return'db("db_name").createCollection("collection")'}dropDatabase(e){return`db("${e}").dropDatabase()`}}class x extends i{showVersion(){return"SELECT CAST(SERVERPROPERTY('ProductVersion') AS SYSNAME)+' '+CAST(SERVERPROPERTY('Edition') AS SYSNAME) AS server_version"}showAllForeignKeys(){return`SELECT 
    OBJECT_SCHEMA_NAME(fk.parent_object_id) AS table_schema,
    OBJECT_NAME(fk.parent_object_id) AS table_name,
    COL_NAME(fc.parent_object_id, fc.parent_column_id) AS column_name,
    OBJECT_SCHEMA_NAME(fk.referenced_object_id) AS referenced_schema,
    OBJECT_NAME(fk.referenced_object_id) AS referenced_table,
    COL_NAME(fc.referenced_object_id, fc.referenced_column_id) AS referenced_column
FROM 
    sys.foreign_keys fk
JOIN 
    sys.foreign_key_columns fc ON fk.object_id = fc.constraint_object_id`}showAllComments(){return`SELECT 
        s.name table_schema,
        t.name AS table_name,
        c2.name AS column_name,
        prop.value AS comment
        FROM 
           sys.columns c2 
                join sys.tables t on c2.object_id=t.object_id
                join sys.schemas s on t.schema_id=s.schema_id 
                join sys.extended_properties prop ON prop.major_id = c2.object_id AND prop.minor_id = c2.column_id`}createIndex(e){return`ALTER TABLE ${e.table} ADD ${e.type} (${e.column})`}dropIndex(e,a){return`DROP INDEX ${e}.${a}`}showIndex(e,a){return`SELECT
        index_name = ind.name,
        column_name = col.name,
        ind.is_primary_key "isPrimary",
        ind.is_unique "isUnique",
        ind.is_unique_constraint,
        CASE 
            WHEN ind.is_primary_key=1 THEN 'PRIMARY'
            WHEN ind.is_unique=1 THEN 'UNIQUE'
            WHEN ind.is_unique_constraint=1 THEN 'UNIQUE'
        ELSE 'INDEX' END index_type
      FROM
        sys.indexes ind
        INNER JOIN sys.index_columns ic ON ind.object_id = ic.object_id
        and ind.index_id = ic.index_id
        INNER JOIN sys.columns col ON ic.object_id = col.object_id
        and ic.column_id = col.column_id
        INNER JOIN sys.tables t ON ind.object_id = t.object_id
      WHERE
        t.name = '${a}';`}kill(e){return`kill ${e.ID};`}processList(){return`SELECT
    s.session_id "ID",
    s.login_name "User",
    s.program_name "Client",
    r.status "Status",
    r.wait_time "Wait Time",
    d.text "SQL"
FROM sys.dm_exec_sessions s
LEFT JOIN sys.dm_exec_requests r ON s.session_id = r.session_id
Outer APPLY sys.dm_exec_sql_text(sql_handle) d
WHERE s.is_user_process = 1;`}addColumn(e,a){return`ALTER TABLE ${e} 
    ADD $1 [type]$2;`}createUser(){return`CREATE LOGIN loginName$1 WITH PASSWORD = 'password$2';
-- user master[YourDatabaseName]
CREATE USER userName$3 FOR LOGIN loginName$1;
ALTER ROLE db_datareader ADD MEMBER userName$3;
ALTER ROLE db_datawriter ADD MEMBER userName$3;
-- ALTER ROLE db_ddladmin ADD MEMBER userName$3;`}updateColumn(e,a){const{name:t,type:n,comment:E,nullable:r,defaultValue:s}=a,o=r=="YES"?"NULL":"NOT NULL";return`-- change column type
ALTER TABLE ${e} 
    ALTER COLUMN ${t} ${n} ${o};
-- change column name
EXEC sp_rename '${e}.${t}', '${t}', 'COLUMN';`}updateColumnSql(e){const{columnName:a,columnType:t,defaultValue:n,newColumnName:E,comment:r,oldRow:s,isNotNull:o,schema:c,table:_}=e,A=o?"NOT NULL":"NULL";return new u(`ALTER TABLE "${c}"."${_}" ALTER COLUMN "${a}" ${t} ${A};`,`
`).if(s?.defaultValue&&s.defaultValue!=n,()=>`DECLARE @constraintName NVARCHAR(128)
         SELECT @constraintName = dc.name
         FROM sys.default_constraints dc
         JOIN sys.columns c ON c.object_id = dc.parent_object_id AND c.column_id = dc.parent_column_id
         WHERE c.object_id = OBJECT_ID('${c}.${_}')
         AND c.name = '${a}';
         IF @constraintName IS NOT NULL
         BEGIN
             EXEC('ALTER TABLE "${c}"."${_}" DROP CONSTRAINT ' + @constraintName);
         END;`).if(!N(n)&&s.defaultValue!=n,()=>`ALTER TABLE "${c}"."${_}" ADD CONSTRAINT DF_${_}_${a} DEFAULT ${L(n,t)} FOR "${a}";`).if(a!=E,()=>`EXEC sp_rename '${c}.${_}.${a}' , '${E}', 'COLUMN';`).if(r!=s.comment,()=>`EXEC ${s.comment?"sp_updateextendedproperty":"sp_addextendedproperty"} 
@level0type = N'Schema', @level0name = '${c}',
@level1type = N'Table', @level1name = '${_}', 
@level2type = N'Column', @level2name = '${E}',
@name = N'MS_Description', @value = N'${r}';`).toString()}showDatabaseUsers(){return"SELECT name [user] from sys.database_principals WHERE type IN ('S', 'U', 'G','E') "}updateTable(e){const{schema:a,table:t,newTableName:n,comment:E,newComment:r}=e;let s="";return r&&r!=E&&(s=`EXEC ${E?"sp_updateextendedproperty":"sp_addextendedproperty"} 
@level0type = N'Schema', @level0name = '${a}',
@level1type = N'Table', @level1name = '${t}', 
@name = N'MS_Description', @value = N'${r}';`),n&&t!=n&&(s+=`sp_rename '${t}', '${n}';`),s}truncateDatabase(e){return`SELECT Concat('TRUNCATE TABLE [',table_schema,'].[',TABLE_NAME, '];') trun FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE'  AND TABLE_SCHEMA='${e}'`}createDatabase(e){return`create database ${e||"[name]"}`}showViewSource(e,a){return`SELECT definition 'Create View' FROM sys.sql_modules WHERE object_id = OBJECT_ID('${e}.${a}');`}showProcedureSource(e,a){return`SELECT definition 'Create Procedure','${e}.${a}' "Procedure" FROM sys.sql_modules WHERE object_id = OBJECT_ID('${e}.${a}');`}showFunctionSource(e,a){return`SELECT definition 'Create Function','${e}.${a}' "Function" FROM sys.sql_modules WHERE object_id = OBJECT_ID('${e}.${a}');`}showTriggerSource(e,a){return`SELECT definition 'SQL Original Statement','${e}.${a}' "Trigger" FROM sys.sql_modules WHERE object_id = OBJECT_ID('${e}.${a}');`}showColumns(e,a){return["information_schema","sys"].includes(e?.toLowerCase())?`SELECT
            name,
            type_name(system_type_id) "type",
            is_nullable nullable,
            max_length "maximum_length"
        FROM
            sys.all_columns
        WHERE
            object_id = OBJECT_ID('${e}.${a}') ;`:`SELECT 
               c.COLUMN_NAME "name",
               DATA_TYPE "type",
               numeric_precision "precision",
               numeric_scale "scale",
               IS_NULLABLE nullable, CHARACTER_MAXIMUM_LENGTH "maximum_length", COLUMN_DEFAULT "defaultValue", '' "comment", tc.constraint_type "key",
               COLUMNPROPERTY(object_id('${e}.${a}'), c.COLUMN_NAME, 'IsIdentity') extra
               FROM
               INFORMATION_SCHEMA.COLUMNS c
               left join  INFORMATION_SCHEMA.CONSTRAINT_COLUMN_USAGE ccu
               on c.COLUMN_NAME=ccu.column_name and c.table_name=ccu.table_name and ccu.TABLE_SCHEMA=c.TABLE_SCHEMA
               left join  INFORMATION_SCHEMA.TABLE_CONSTRAINTS tc
               on tc.constraint_name=ccu.constraint_name
               and tc.TABLE_SCHEMA=c.TABLE_SCHEMA and tc.table_name=c.table_name WHERE c.TABLE_SCHEMA = '${e}' AND c.table_name = '${a}' ORDER BY ORDINAL_POSITION`}showChecks(e,a){return`SELECT
        tc.CONSTRAINT_NAME "name",
        cc.CHECK_CLAUSE "clause"
    FROM
        "INFORMATION_SCHEMA"."CHECK_CONSTRAINTS" AS cc,
        "INFORMATION_SCHEMA"."TABLE_CONSTRAINTS" AS tc
    WHERE
        tc.CONSTRAINT_SCHEMA = '${e}'
        AND tc.TABLE_NAME = '${a}'
        AND tc.CONSTRAINT_TYPE = 'CHECK'
        AND tc.CONSTRAINT_SCHEMA = cc.CONSTRAINT_SCHEMA
        AND tc.CONSTRAINT_NAME = cc.CONSTRAINT_NAME;`}showForeignKeys(e,a){return`SELECT
        f.name AS "constraint_name",
        COL_NAME( fkc.parent_object_id, fkc.parent_column_id ) AS "column_name",
        OBJECT_NAME (fkc.referenced_object_id) AS "referenced_table",
        COL_NAME( fkc.referenced_object_id, fkc.referenced_column_id )  AS "referenced_column",
        update_referential_action_desc "updateRule",
        delete_referential_action_desc "deleteRule"
    FROM
        sys.foreign_key_columns fkc
        JOIN sys.foreign_keys f ON f.object_id = fkc.constraint_object_id
        JOIN sys.tables tab1 ON tab1.object_id = fkc.parent_object_id and tab1.name='${a}' and SCHEMA_NAME(tab1.schema_id)='${e}'
    ;`}showTriggers(e,a){const t=a?` AND tb.name='${a}'`:"";return`SELECT 
                tr.name AS trigger_name, 
                tb.name AS table_name,
                'Statement' AS orientation,
                OBJECT_DEFINITION(tr.object_id) AS source
            FROM 
                sys.triggers tr
                INNER JOIN sys.tables tb ON tr.parent_id = tb.object_id
                INNER JOIN sys.schemas sc ON tb.schema_id = sc.schema_id
            WHERE 
                tr.is_ms_shipped = 0
                AND sc.name = '${e}' ${t}`}showProcedures(e){return`SELECT ROUTINE_NAME FROM INFORMATION_SCHEMA.ROUTINES WHERE SPECIFIC_SCHEMA = '${e}' and ROUTINE_TYPE='PROCEDURE' ORDER BY ROUTINE_NAME`}showFunctions(e){return`SELECT ROUTINE_NAME FROM INFORMATION_SCHEMA.ROUTINES WHERE SPECIFIC_SCHEMA = '${e}' and ROUTINE_TYPE='FUNCTION' ORDER BY ROUTINE_NAME`}showViews(e,a){return`SELECT name FROM sys.all_views t where SCHEMA_NAME(t.schema_id)='${a}' order by name`}buildPageSql(e,a,t){return`SELECT TOP ${t} * FROM ${a};`}showTables(e,a){return`SELECT 
    t.name AS 'name', 
    ep.value AS 'comment', 
    t.is_ms_shipped AS 'isSystem',
    p.rows AS 'table_rows',
    SUM(a.total_pages) * 8 * 1024 AS 'data_length'
FROM 
    sys.tables t
    LEFT JOIN sys.extended_properties ep ON ep.major_id = t.object_id AND ep.minor_id = 0 AND ep.name = 'MS_Description'
    LEFT JOIN sys.indexes i ON t.object_id = i.object_id
    LEFT JOIN sys.partitions p ON i.object_id = p.object_id AND i.index_id = p.index_id
    LEFT JOIN sys.allocation_units a ON p.partition_id = a.container_id
WHERE
    t.schema_id = SCHEMA_ID('${a}')
GROUP BY 
    t.name, ep.value, t.is_ms_shipped, p.rows
ORDER BY 
    t.is_ms_shipped, t.name;`}showDatabases(){return"SELECT name 'Database' FROM sys.databases"}showSchemas(){return"SELECT SCHEMA_NAME [schema] FROM INFORMATION_SCHEMA.SCHEMATA"}tableTemplate(e){return`CREATE TABLE ${(e=="dbo"?"":`${e}.`)+"table_name"}$1(  
    id int IDENTITY(1,1) primary key,
    create_time DATETIME,
    update_time DATETIME,
    content$2 NVARCHAR(255)
);
EXECUTE sp_addextendedproperty N'MS_Description', '[table_comment]', N'user', N'dbo', N'table', N'[table_name]', NULL, NULL;
EXECUTE sp_addextendedproperty N'MS_Description', '[column_comment]', N'user', N'dbo', N'table', N'[table_name]', N'column', N'[column_name]';
`}viewTemplate(){return`CREATE VIEW dbo.view_name$1
AS
SELECT * FROM 
`}procedureTemplate(){return`CREATE PROCEDURE dbo.procedure_name$1
AS
BEGIN
    $2
END;`}functionTemplate(){return`CREATE FUNCTION dbo.function_name$1() RETURNS [TYPE]
BEGIN
    $2
    return [value];
END;`}triggerTemplate(e){return`CREATE TRIGGER trigger_name$1
ON ${e??"[table_name]$2"}
[FOR/AFTER] INSERT
AS
BEGIN
    $3
END;`}showRoles(){return"SELECT name FROM sys.server_principals WHERE type = 'R' ORDER BY name;"}showDatabaseRoles(){return"SELECT name FROM sys.database_principals WHERE type = 'R' ORDER BY name;"}createRole(){return`CREATE ROLE role_name$1;
-- Grant role privileges
GRANT role_name$1 TO role_name$2;`}updateRole(e){return`ALTER ROLE ${e} 
-- WITH NAME = new_name
;`}grantRole(e){return`ALTER ROLE ${e} ADD MEMBER role_name$1;`}showLogins(){return`SELECT name as login, type_desc, is_disabled, create_date, modify_date 
        FROM sys.server_principals 
        WHERE type IN ('S', 'U', 'G','E') 
        ORDER BY name;`}createLogin(){return`-- Create SQL Server login
CREATE LOGIN login_name$1 WITH PASSWORD = 'password$2';
-- Create Windows login
-- CREATE LOGIN [domainlogin_name$1] FROM WINDOWS;
-- Create login with additional options
-- CREATE LOGIN login_name$1 WITH PASSWORD = 'password$2', 
--     CHECK_POLICY = ON,
--     CHECK_EXPIRATION = ON,
--     DEFAULT_DATABASE = master,
--     DEFAULT_LANGUAGE = us_english;`}updateLogin(e){return`-- Change password
ALTER LOGIN ${e} WITH PASSWORD = 'new_password$1';
-- Disable/Enable login
-- ALTER LOGIN ${e} DISABLE;
-- ALTER LOGIN ${e} ENABLE;
-- Change default database
-- ALTER LOGIN ${e} WITH DEFAULT_DATABASE = database_name;
-- Change default language
-- ALTER LOGIN ${e} WITH DEFAULT_LANGUAGE = language;`}dropLogin(e){return`DROP LOGIN ${e};`}}class V extends g{showVersion(){return"call dbms.components() yield name, versions, edition unwind versions as server_version return server_version;"}showDatabases(){return"SHOW DATABASES yield name AS Database"}showSchemas(){return this.showDatabases()}showTables(e){return"call db.labels() yield label as name RETURN name ORDER BY toLower(name)"}addColumn(e,a){return`MATCH (n:${e}) WHERE id(n) = 1 SET n.name = 'name' RETURN n`}showColumns(e,a){return`MATCH(n:\`${a}\`) UNWIND keys(n) AS name RETURN DISTINCT name`}showIndex(e,a){return`show indexes yield name as index_name, properties as column_name, type as index_type, labelsOrTypes where '${a}' in labelsOrTypes`}showViews(e){return"call db.relationshipTypes() yield relationshipType AS name RETURN name ORDER BY toLower(name)"}showUsers(){return"SHOW USERS"}createUser(){return`CREATE USER [name] IF NOT EXISTS 
    SET PASSWORD 'password';`}buildPageSql(e,a,t){return`MATCH (n${a=="*"?"":`:${a}`}) RETURN n LIMIT ${t}`}createDatabase(e){return"CREATE DATABASE $1"}tableTemplate(){return"CREATE (n:node {id:1}) return n;"}createIndex(e){return`CREATE INDEX FOR (n:${e.table}) ON (n.id)`}dropIndex(e,a){return`DROP INDEX \`${a}\``}viewTemplate(){return"MATCH (n1:node {id:1}), (n2:node {id:2}) CREATE (n1)-[r:TO]->(n2) RETURN type(r)"}}class b extends C{defaultPart(){const{oldRow:e,isAutoIncrement:a,defaultValue:t,columnType:n}=this.param,E=t?.match?.(/\bnextval\b/);if(a&&!e.isAutoIncrement&&!E)return`${this.afterColumnPrefix} ADD GENERATED ALWAYS AS IDENTITY;`;if(!a&&e.isAutoIncrement&&!E)return`${this.afterColumnPrefix} DROP IDENTITY;`;if(!a&&e.isAutoIncrement&&E)return`${this.afterColumnPrefix} DROP DEFAULT;`;if(e.defaultValue==t)return"";const c=t?.match?.(/\bnextval\b/)?t:L(t,n);return`${this.afterColumnPrefix} ${N(t)?"DROP DEFAULT":`SET DEFAULT ${c}`};`}commentPart(){const{oldRow:e,table:a,columnName:t,comment:n}=this.param;if(n!=e.comment)return`COMMENT ON COLUMN "${a}"."${t}" is '${n}';`}}class $ extends i{showVersion(){return"SHOW server_version;"}createIndex(e){const a=e.name??`${e.column||"[column]"}`,t=e.indexType||"btree";return`CREATE INDEX ${a}_${new Date().getTime()}_index ON 
    ${e.table} USING ${t} ("${e.column||"[column]"}");`}dropIndex(e,a){return`DROP INDEX "${a}"`}showIndex(e,a){return`select
    t.relname as table_name,
    i.relname as index_name,
    a.attname as column_name,
    ix.indisprimary "isPrimary",
    ix.indisunique "isUnique",
    CASE ix.indisprimary
        WHEN true THEN 'PRIMARY'
    ELSE CASE ix.indisunique
        WHEN true THEN 'UNIQUE'
    ELSE 'KEY'
    END
    END AS index_type,
    am.amname index_method,
    pg_get_indexdef(ix.indexrelid) as index_definition
  from
    pg_class t
    JOIN pg_catalog.pg_namespace pgn ON pgn.oid=t.relnamespace and pgn.nspname='${e}'
    JOIN pg_index ix on t.oid = ix.indrelid
    JOIN pg_class i on ix.indexrelid = i.oid
    JOIN pg_am am ON am.oid=i.relam
    LEFT JOIN pg_attribute a on t.oid = a.attrelid and a.attnum = ANY(ix.indkey)
  where
     t.relkind = 'r'
    and t.relname = '${a}'
  order by
    ix.indexrelid;`}variableList(){return"SHOW ALL"}statusList(){return`SELECT
        'db_numbackends' AS db,
        pg_stat_get_db_numbackends(datid) AS status
      FROM
        pg_stat_database
      WHERE
        datname = current_database()
      UNION ALL
      SELECT
        'db_xact_commit',
        pg_stat_get_db_xact_commit(datid)
      FROM
        pg_stat_database
      WHERE
        datname = current_database()
      UNION ALL
      SELECT
        'db_xact_rollback',
        pg_stat_get_db_xact_rollback(datid)
      FROM
        pg_stat_database
      WHERE
        datname = current_database()
      UNION ALL
      SELECT
        'db_blocks_fetched',
        pg_stat_get_db_blocks_fetched(datid)
      FROM
        pg_stat_database
      WHERE
        datname = current_database()
      UNION ALL
      SELECT
        'db_blocks_hit',
        pg_stat_get_db_blocks_hit(datid)
      FROM
        pg_stat_database
      WHERE
        datname = current_database()`}kill(e){return`SELECT pg_terminate_backend(${e.ID})`}processList(){return`SELECT
        a.pid AS "ID",
        query_start AS "Time",
        datname AS "db",
        CASE
        WHEN c.relname IS NOT NULL THEN c.relname
        ELSE l.virtualtransaction
        END AS "Target",
        l.mode AS "State",
        query AS "SQL"
      FROM
        pg_stat_activity a
        LEFT JOIN pg_locks l ON a.pid = l.pid
        LEFT JOIN pg_class c ON l.relation = c.oid
      ORDER BY
        a.pid ASC,
        c.relname ASC`}addColumn(e,a){return`ALTER TABLE ${e} 
  ADD COLUMN [column] [type];
COMMENT ON COLUMN ${e}.[column] IS 'comment';`}createUser(){return`CREATE USER $1 WITH PASSWORD 'password$2';
-- Grant select privilege;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO $1;
-- Grant all privileges;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO $1;`}updateUser(e){return`ALTER USER ${e} WITH PASSWORD 'new_password';`}updateColumn(e,a){const{name:t,type:n,comment:E,nullable:r,defaultValue:s}=a;return`-- change column type
ALTER TABLE ${e} 
    ALTER COLUMN ${t} TYPE ${n};
-- change column name
ALTER TABLE ${e} 
    RENAME COLUMN ${t} TO ${t};
-- Change column comment
COMMENT ON COLUMN ${e}.${t} IS '${E||"comment"}';`}updateColumnSql(e){return new b(e).genAlterSQL()}showUsers(){return'SELECT usename "user" from pg_user '}showAllForeignKeys(){return`SELECT
    c.conname AS constraint_name,
    sch.nspname AS table_schema,
    tbl.relname AS table_name,
    (col.attname) as column_name,
    f_tbl.relname AS referenced_table,
    (f_col.attname) as referenced_column,
    c.confupdtype AS "updateRule",
    c.confdeltype AS "deleteRule"
FROM pg_constraint c
LEFT JOIN LATERAL UNNEST(c.conkey)
    WITH ORDINALITY AS u(attnum, attposition)
    ON TRUE
LEFT JOIN LATERAL UNNEST(c.confkey)
    WITH ORDINALITY AS f_u(attnum, attposition)
    ON f_u.attposition = u.attposition
JOIN pg_class tbl ON tbl.oid = c.conrelid
JOIN pg_namespace sch ON sch.oid = tbl.relnamespace
LEFT JOIN pg_attribute col
    ON (col.attrelid = tbl.oid AND col.attnum = u.attnum)
LEFT JOIN pg_class f_tbl ON f_tbl.oid = c.confrelid
LEFT JOIN pg_namespace f_sch ON f_sch.oid = f_tbl.relnamespace
LEFT JOIN pg_attribute f_col
    ON (f_col.attrelid = f_tbl.oid AND f_col.attnum = f_u.attnum)
WHERE c.contype = 'f'`}showForeignKeys(e,a){return`SELECT
    c.conname AS constraint_name,
    (col.attname) as column_name,
    f_tbl.relname AS referenced_table,
    (f_col.attname) as referenced_column,
    c.confupdtype AS "updateRule",
    c.confdeltype AS "deleteRule"
FROM pg_constraint c
LEFT JOIN LATERAL UNNEST(c.conkey) WITH ORDINALITY AS u(attnum, attposition) ON TRUE
LEFT JOIN LATERAL UNNEST(c.confkey) WITH ORDINALITY AS f_u(attnum, attposition) ON f_u.attposition = u.attposition
JOIN pg_class tbl ON tbl.oid = c.conrelid
JOIN pg_namespace sch ON sch.oid = tbl.relnamespace
LEFT JOIN pg_attribute col ON (col.attrelid = tbl.oid AND col.attnum = u.attnum)
LEFT JOIN pg_class f_tbl ON f_tbl.oid = c.confrelid
LEFT JOIN pg_namespace f_sch ON f_sch.oid = f_tbl.relnamespace
LEFT JOIN pg_attribute f_col ON (f_col.attrelid = f_tbl.oid AND f_col.attnum = f_u.attnum)
WHERE c.contype = 'f' and sch.nspname = '${e}' and tbl.relname = '${a}'`}pingDataBase(e){return e?`set search_path to '${e}';`:null}updateTable(e){const{table:a,newTableName:t,comment:n,newComment:E}=e;let r="";return E&&E!=n&&(r=`COMMENT ON TABLE "${a}" IS '${E}';`),t&&a!=t&&(r+=`ALTER TABLE "${a}" RENAME TO "${t}";`),r}truncateDatabase(e){return`SELECT Concat('TRUNCATE TABLE "',TABLE_NAME, '";') trun FROM INFORMATION_SCHEMA.TABLES WHERE  table_schema ='${e}' AND table_type='BASE TABLE';`}createDatabase(e){return"CREATE DATABASE $1"}showViewSource(e,a,t){return`select pg_get_viewdef('${e}.${a}' :: regclass) "Create View"`}showProcedureSource(e,a){return`select pg_get_functiondef('${e}.${a}' :: regproc) "Create Procedure",'${a}' "Procedure";`}showTriggerSource(e,a){return`select pg_get_triggerdef(oid) "SQL Original Statement",'${e}.${a}' "Trigger" from pg_trigger where tgname = '${a}';`}showColumns(e,a,t){return`SELECT 
          ${t?"c.*,":""}
          c.COLUMN_NAME "name", 
          atttypid::regtype AS pg_reg_type,
          DATA_TYPE "type",
          IS_NULLABLE nullable, 
          numeric_precision "precision",
          numeric_scale "scale",
          CHARACTER_MAXIMUM_LENGTH "maximum_length", 
          COLUMN_DEFAULT "defaultValue", 
          pg_catalog.col_description(pgc.oid, c.ordinal_position::int) AS "comment",
          tc.constraint_type "key",
          tc.constraint_name "constraint_name",
          cc.table_name "referenced_table",
          cc.column_name "referenced_column",
          pa.*
        FROM information_schema.columns c
        JOIN pg_catalog.pg_class pgc ON c.table_name = pgc.relname 
        JOIN pg_catalog.pg_namespace pgn ON pgn.oid=pgc.relnamespace and pgn.nspname=c.table_schema
        JOIN pg_attribute pa on pa.attname =c.column_name and pa.attrelid =pgc.oid 
        LEFT JOIN information_schema.key_column_usage ccu on ccu.table_schema=c.table_schema
          and ccu.table_name=c.table_name and ccu.column_name=c.COLUMN_NAME
        LEFT JOIN information_schema.table_constraints tc on tc.table_schema=c.table_schema 
          and tc.table_name=c.table_name and tc.constraint_name=ccu.constraint_name
        LEFT JOIN information_schema.constraint_column_usage cc on cc.table_schema=c.table_schema 
          and cc.constraint_name=tc.constraint_name and  tc.constraint_type='FOREIGN KEY'
        WHERE c.TABLE_SCHEMA = '${e}' AND c.table_name = '${a}' 
        ORDER BY c.ORDINAL_POSITION;`}showChecks(e,a){return`SELECT
    tc.CONSTRAINT_NAME "name",
    cc.CHECK_CLAUSE "clause"
FROM
    "information_schema"."check_constraints" AS cc,
    "information_schema"."table_constraints" AS tc
WHERE
    tc.CONSTRAINT_SCHEMA = '${e}'
    AND tc.TABLE_NAME = '${a}'
    AND tc.CONSTRAINT_TYPE = 'CHECK'
    AND tc.CONSTRAINT_SCHEMA = cc.CONSTRAINT_SCHEMA
    AND tc.CONSTRAINT_NAME = cc.CONSTRAINT_NAME
    AND cc.CONSTRAINT_NAME NOT LIKE '%_not_null'`}showPartitions(e,a){return`select col.column_name "columnName", pt.partition_strategy "strategy" from (
      select
          partrelid, partnatts, case partstrat when 'h' then 'HASH' when 'l' then 'LIST' when 'r' then 'RANGE' end as partition_strategy, unnest(partattrs) column_index
      from
          pg_partitioned_table ) pt
      join pg_class pc on pc.oid = pt.partrelid
      join information_schema.columns col on col.table_schema = pc.relnamespace :: regnamespace :: text
        and col.table_name = pc.relname and col.ordinal_position = pt.column_index
      WHERE col.table_schema='${e}' and col.table_name='${a}';`}showTriggers(e,a){const t=a?` AND event_object_table='${a}'`:"";return`SELECT 
              event_object_table table_name,
              trigger_name "trigger_name",
              action_timing timing,
              event_manipulation manipulation ,
              action_orientation orientation,
              action_statement "statement"
            FROM 
              information_schema.TRIGGERS 
            WHERE trigger_schema = '${e}' ${t} 
            ORDER BY TRIGGER_NAME ASC`}showProcedures(e){return`SELECT p.proname "ROUTINE_NAME",
    pg_get_functiondef(p.oid) source,
    p.oid,
    pg_get_function_identity_arguments(p.oid) "argDefs"
from
    pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    and n.nspname = '${e}'
    and p.prokind = 'p'
order by p.proname`}showFunctions(e){return`SELECT DISTINCT
    r.ROUTINE_NAME AS "name",
    p.oid,
    pg_get_function_identity_arguments(p.oid) "argDefs",
    CASE 
        WHEN p.prorettype = 'pg_catalog.trigger'::regtype THEN 'Trigger'
        ELSE null
    END AS "function_type"
FROM 
    information_schema.routines r
    JOIN pg_proc p ON r.ROUTINE_NAME = p.proname 
    JOIN pg_namespace n ON p.pronamespace = n.oid 
    AND n.nspname = '${e}'
WHERE 
    r.ROUTINE_SCHEMA = '${e}' 
    AND r.ROUTINE_TYPE = 'FUNCTION' 
ORDER BY 
    r.ROUTINE_NAME ASC`}showFunctionSource(e,a,t){return t?`select pg_get_functiondef('${t}') "Create Function",'${a}' "Function";`:`select pg_get_functiondef('${e}.${a}' :: regproc) "Create Function",'${a}' "Function";`}showViews(e,a){return`select table_name "name" from information_schema.tables where table_schema='${a}' and table_type='VIEW' order by "name";`}showMaterialViews(e,a){return`SELECT matviewname "name" from pg_matviews WHERE schemaname='${a}' order by "name" ASC`}buildPageSql(e,a,t){return`SELECT * FROM ${a} LIMIT ${t};`}showTables(e,a){return`SELECT t.table_name "name", 
    pg_catalog.obj_description(pgc.oid, 'pg_class') "comment",
    pgc.reltuples "table_rows",
    pg_total_relation_size(quote_ident(table_name)) AS "data_length"
FROM information_schema.tables t
JOIN pg_catalog.pg_class pgc ON t.table_name = pgc.relname 
JOIN pg_catalog.pg_namespace pgn ON pgn.oid=pgc.relnamespace and pgn.nspname=t.table_schema
WHERE t.table_type='BASE TABLE'
AND t.table_schema='${a}' order by t.table_name;`}showDatabases(){return"SELECT datname FROM pg_database WHERE datistemplate = false order by datname ASC;"}showSchemas(){return'SELECT nspname "schema" from pg_catalog.pg_namespace order by nspname ASC;'}showSequences(e){return`SELECT sequencename AS name, 
                   last_value AS sequence, 
                   increment_by AS increment
            FROM pg_sequences 
            WHERE schemaname='${e}' 
            ORDER BY name;`}showCustomTypes(e){return`SELECT  t.typname as name,typtype as type,string_agg(pg_enum.enumlabel, ',') enum_values
    FROM        pg_type t 
    LEFT JOIN   pg_enum ON pg_enum.enumtypid = t.oid
    LEFT JOIN   pg_catalog.pg_namespace n ON n.oid = t.typnamespace 
    WHERE (t.typrelid = 0 OR (SELECT c.relkind = 'c' FROM pg_catalog.pg_class c WHERE c.oid = t.typrelid)) 
    AND     NOT EXISTS(SELECT 1 FROM pg_catalog.pg_type el WHERE el.oid = t.typelem AND el.typarray = t.oid)
    and n.nspname='${e}' GROUP BY name,type;`}tableTemplate(){return`CREATE TABLE table_name$1(  
    id int NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    create_time DATE,
    name$2 VARCHAR(255)
);
COMMENT ON TABLE table_name$1 IS '$3';
COMMENT ON COLUMN table_name$1.name$2 IS '$4';`}viewTemplate(e){return`CREATE ${e?"MATERIALIZED ":""}VIEW view_name$1
AS
SELECT * FROM $2`}procedureTemplate(){return`CREATE PROCEDURE proc_name$1()
LANGUAGE SQL
as $$
[$2]
$$;`}triggerTemplate(e){return`CREATE FUNCTION trigger_fun$1() RETURNS TRIGGER AS 
\\$body\\$
BEGIN
    $2
    RETURN [value];
END;
\\$body\\$ 
LANGUAGE plpgsql;

CREATE TRIGGER [name]$3
[BEFORE/AFTER] INSERT
ON ${e??"[table_name]$4"}
FOR EACH ROW
EXECUTE PROCEDURE [trigger_fun]();`}dropTriggerTemplate(e,a){return`DROP TRIGGER ${e} on ${a}`}functionTemplate(){return`CREATE FUNCTION fun_name$1() 
RETURNS int$2 AS $$
BEGIN
    $3
    return 0;
END;
$$ LANGUAGE plpgsql;`}showRoles(){return`SELECT rolname as name, rolsuper as is_superuser, rolcreaterole as can_create_role, 
            rolcreatedb as can_create_db, rolcanlogin as can_login, rolreplication as can_replicate
            FROM pg_roles ORDER BY rolname;`}createRole(){return`CREATE ROLE role_name$1 WITH LOGIN PASSWORD 'password$2';
-- Grant role privileges
GRANT role_name$1 TO postgres;`}updateRole(e){return`ALTER ROLE ${e} WITH 
-- LOGIN/NOLOGIN
-- PASSWORD 'new_password'
-- SUPERUSER/NOSUPERUSER
-- CREATEDB/NOCREATEDB
-- CREATEROLE/NOCREATEROLE
-- INHERIT/NOINHERIT
-- REPLICATION/NOREPLICATION
-- BYPASSRLS/NOBYPASSRLS
-- CONNECTION LIMIT connlimit
-- VALID UNTIL 'timestamp'
;`}grantRole(e){return`GRANT ${e} TO role_name$1;`}}class p extends ${showAllForeignKeys(){return`SELECT
      refc.constraint_name "constraint_name",
      refc.constraint_schema "table_schema",
      kcu.table_name "table_name",
      kcu.column_name AS "column_name",
      ccu.table_name AS "referenced_table",
      ccu.column_name AS "referenced_column"
  FROM
      information_schema.referential_constraints AS refc,
      information_schema.key_column_usage AS kcu,
      information_schema.constraint_column_usage AS ccu
  WHERE
      refc.constraint_name = kcu.constraint_name
      AND refc.constraint_schema = kcu.table_schema
      AND ccu.constraint_name = refc.constraint_name;`}showForeignKeys(e,a){return`SELECT
      refc.constraint_name "constraint_name",
      kcu.column_name AS column_name,
      ccu.table_name AS referenced_table,
      ccu.column_name AS referenced_column,
      kcu.ordinal_position AS ord_position,
      refc.update_rule "updateRule",
      refc.delete_rule "deleteRule"
  FROM
      information_schema.referential_constraints AS refc,
      information_schema.key_column_usage AS kcu,
      information_schema.constraint_column_usage AS ccu
  WHERE
      refc.constraint_schema = '${e}'
      AND refc.constraint_name = kcu.constraint_name
      AND refc.constraint_schema = kcu.table_schema
      AND ccu.constraint_name = refc.constraint_name
      AND kcu.table_name = '${a}'
  ORDER BY ord_position;`}showProcedures(e){return`SELECT ROUTINE_NAME "ROUTINE_NAME" FROM information_schema.routines WHERE ROUTINE_SCHEMA = '${e}' and ROUTINE_TYPE='PROCEDURE' ORDER BY ROUTINE_NAME ASC`}}class v extends p{showVersion(){return"SELECT VERSION() as server_version"}createIndex(e){return null}variableList(){return"SHOW ALL"}statusList(){return`SELECT
        'db_numbackends' AS db,
        pg_stat_get_db_numbackends(datid) AS status
      FROM
        pg_stat_database
      WHERE
        datname = current_database()
      UNION ALL
      SELECT
        'db_xact_commit',
        pg_stat_get_db_xact_commit(datid)
      FROM
        pg_stat_database
      WHERE
        datname = current_database()
      UNION ALL
      SELECT
        'db_xact_rollback',
        pg_stat_get_db_xact_rollback(datid)
      FROM
        pg_stat_database
      WHERE
        datname = current_database()
      UNION ALL
      SELECT
        'db_blocks_fetched',
        pg_stat_get_db_blocks_fetched(datid)
      FROM
        pg_stat_database
      WHERE
        datname = current_database()
      UNION ALL
      SELECT
        'db_blocks_hit',
        pg_stat_get_db_blocks_hit(datid)
      FROM
        pg_stat_database
      WHERE
        datname = current_database()`}processList(){return`SELECT
        a.pid AS "Id",
        a.usename AS "User",
        a.client_addr AS "Host",
        a.client_port AS "Port",
        datname AS "db",
        query AS "Command",
        l.mode AS "State",
        query_start AS "Time",
        CASE
          WHEN c.relname IS NOT NULL THEN 'Locked Object: ' || c.relname
          ELSE 'Locked Transaction: ' || l.virtualtransaction
        END AS "Info"
      FROM
        pg_stat_activity a
        LEFT JOIN pg_locks l ON a.pid = l.pid
        LEFT JOIN pg_class c ON l.relation = c.oid
      ORDER BY
        a.pid ASC,
        c.relname ASC`}addColumn(e,a){return`ALTER TABLE ${e}
  ADD COLUMN [column] [type];
COMMENT ON COLUMN ${e}.[column] IS 'comment';`}createUser(){return"CREATE USER [name] WITH PASSWORD 'password';"}updateUser(e){return`ALTER USER ${e} WITH PASSWORD 'new_password';`}updateColumn(e,a){const{name:t,type:n}=a;return`-- change column type
ALTER TABLE ${e}
    ALTER COLUMN ${t} TYPE ${n};
-- change column name
ALTER TABLE ${e}
    RENAME COLUMN ${t} TO ${t};`}updateColumnSql(e){return new b(e).genAlterSQL()}showUsers(){return'SELECT usename "user" from pg_user '}updateTable(e){const{table:a,newTableName:t,comment:n,newComment:E}=e;let r="";return E&&E!=n&&(r=`COMMENT ON TABLE "${a}" IS '${E}';`),t&&a!=t&&(r+=`ALTER TABLE "${a}" RENAME TO "${t}";`),r}truncateDatabase(e){return`SELECT Concat('TRUNCATE TABLE "',TABLE_NAME, '";') trun FROM INFORMATION_SCHEMA.TABLES WHERE  table_schema ='${e}' AND table_type='BASE TABLE';`}createDatabase(e){return"CREATE DATABASE $1"}showTableSource(e,a){return`SHOW TABLE "${e}"."${a}"`}showViewSource(e,a){return`SHOW VIEW "${e}"."${a}"`}showProcedureSource(e,a){return`select pg_get_functiondef('${e}.${a}' :: regproc) "Create Procedure",'${a}' "Procedure";`}showFunctionSource(e,a){return`select pg_get_functiondef('${e}.${a}' :: regproc) "Create Function",'${a}' "Function";`}showTriggerSource(e,a){return`select pg_get_triggerdef(oid) "SQL Original Statement",'${e}.${a}' "Trigger" from pg_trigger where tgname = '${a}';`}showPartitions(e,a){return""}showIndex(e,a){return`select
    t.relname as table_name,
    i.relname as index_name,
    a.attname as column_name,
    ix.indisprimary "isPrimary",
    ix.indisunique "isUnique",
    CASE ix.indisprimary
        WHEN true THEN 'PRIMARY'
    ELSE CASE ix.indisunique
        WHEN true THEN 'UNIQUE'
    ELSE 'KEY'
    END
    END AS index_type,
    am.amname index_method
  from
    pg_class t
    join pg_catalog.pg_namespace pgn ON pgn.oid=t.relnamespace and pgn.nspname='${e}'
    join pg_index ix on t.oid = ix.indrelid
    join pg_class i on ix.indexrelid = i.oid
    JOIN pg_am am ON am.oid=i.relam
    LEFT JOIN pg_attribute a on t.oid = a.attrelid and a.attnum = ANY(string_to_array(textin(int2vectorout(ix.indkey)),' ')::int[])
  where
     t.relkind = 'r'
    and t.relname = '${a}'
  order by
    ix.indexrelid;`}showSequences(e){return`SELECT sequence_name name FROM information_schema.sequences WHERE sequence_schema = '${e}' ORDER BY sequence_name`}showTriggers(e,a){const t=a?` AND event_object_table='${a}'`:"";return`SELECT TRIGGER_NAME "trigger_name" FROM information_schema.TRIGGERS WHERE trigger_schema = '${e}' ${t} ORDER BY TRIGGER_NAME ASC`}showProcedures(e){return`SELECT ROUTINE_NAME "ROUTINE_NAME" FROM information_schema.routines WHERE ROUTINE_SCHEMA = '${e}' and ROUTINE_TYPE='PROCEDURE' ORDER BY ROUTINE_NAME ASC`}showFunctions(e){return`SELECT ROUTINE_NAME "ROUTINE_NAME" FROM information_schema.routines WHERE ROUTINE_SCHEMA = '${e}' and ROUTINE_TYPE='FUNCTION' ORDER BY ROUTINE_NAME ASC `}showTables(e,a){return`  SELECT t.table_name "name", pg_catalog.obj_description(pgc.oid, 'pg_class') "comment",
    pg_total_relation_size(quote_ident(table_name)) AS "data_length"
FROM information_schema.tables t
JOIN pg_catalog.pg_class pgc ON t.table_name = pgc.relname
JOIN pg_catalog.pg_namespace pgn ON pgn.oid=pgc.relnamespace and pgn.nspname=t.table_schema
WHERE t.table_type='BASE TABLE'
AND t.table_schema='${a}' order by t.table_name;`}showSchemas(){return'SELECT nspname "schema" from pg_catalog.pg_namespace order by nspname ASC;'}tableTemplate(){return`CREATE TABLE table_name$1(
    id INT identity(1, 1) NOT NULL PRIMARY KEY,
    create_time DATE,
    update_time DATE,
    content$2 VARCHAR(255)
);
COMMENT ON TABLE table_name IS 'table_comment';
COMMENT ON COLUMN table_name.content IS 'content';`}procedureTemplate(){return`CREATE PROCEDURE procedure_name()
as $$
begin
    SELECT 1;
END;
$$ LANGUAGE plpgsql;`}functionTemplate(){return`CREATE FUNCTION function_name()
RETURNS int STABLE
AS $$
    SELECT 1
$$ LANGUAGE sql;`}}class k extends i{showVersion(){return'select CURRENT_VERSION() as "server_version";'}createIndex(e){let a=`${e.type||"key"}`;return a.match(/BTREE/i)&&(a="key"),`ALTER TABLE ${e.table} ADD ${a} (\`${e.column||"$1"}\`)`}dropIndex(e,a){return`ALTER TABLE ${e} DROP INDEX \`${a}\``}showIndex(e,a){return""}addColumn(e,a){const t=a?` AFTER \`${a}\``:"";return`ALTER TABLE ${e} 
    ADD COLUMN $1 [type]$2 COMMENT '$3'${t};`}createUser(){return`CREATE USER '$1'@'%' IDENTIFIED BY 'password$2';
-- Grant select privilege to all databases;
GRANT SELECT ON *.* TO '$1'@'%' WITH GRANT OPTION;
-- Grant all privileges to all databases;
GRANT ALL PRIVILEGES ON *.* TO '$1'@'%' WITH GRANT OPTION;`}updateColumn(e,a){const{name:t,type:n,comment:E,nullable:r,defaultValue:s,extra:o,character_set_name:c,collation_name:_}=a,A=r!="YES";return new u(`ALTER TABLE ${e}`).append(`
	CHANGE ${t} ${t} ${n}`).if(c,`CHARACTER SET ${c}`).if(_,`COLLATE ${_}`).if(A,"NOT NULL").if(o?.toLowerCase()?.includes("auto_increment"),"AUTO_INCREMENT").if(E,`COMMENT '${E}'`).if(N(s)&&!A,"DEFAULT NULL").if(!N(s),`DEFAULT ${s=="CURRENT_TIMESTAMP"?s:`'${H(s)}'`}`).toString()}updateColumnSql(e){const{table:a,columnName:t,newColumnName:n,columnType:E,isNotNull:r,isAutoIncrement:s,comment:o,defaultValue:c,oldRow:_}=e,A=`ALTER TABLE "${a}"`,m=r?"SET NOT NULL":"DROP NOT NULL";return new u(`${A} ALTER COLUMN "${t}" TYPE ${E};`,`
`).if(o&&o!=_.comment,`${A} ALTER COLUMN "${t}" COMMENT '${o}';`).if(r!=_.isNotNull,`${A} ALTER COLUMN "${t}" ${m};`).if(t!=n,`${A} RENAME COLUMN "${t}" TO "${n}";`).toString()}showCollations(){return""}showChecks(e,a){return""}pingDataBase(e,a){return e?`use "${a}"."${e}"`:"select 1"}updateTable(e){const{table:a,newTableName:t,comment:n,newComment:E,collation:r,newCollation:s}=e;let o="";return E&&E!=n&&(o=`ALTER TABLE \`${a}\` COMMENT = '${E}';`),s&&s!=r&&(o+=`ALTER TABLE \`${a}\` collate = '${s}';`),t&&a!=t&&(o+=`ALTER TABLE \`${a}\` RENAME TO \`${t}\`;`),o}truncateDatabase(e){return`SELECT Concat('TRUNCATE TABLE \`',table_schema,'\`.\`',TABLE_NAME, '\`;') trun FROM INFORMATION_SCHEMA.TABLES where  table_schema ='${e}' and TABLE_TYPE<>'VIEW';`}createDatabase(e){return"CREATE DATABASE $1;"}showTableSource(e,a){return`select get_ddl('table', '${e}.${a}') "Create Table";`}showViewSource(e,a){return`select get_ddl('view', '${e}.${a}') "Create View";`}showProcedureSource(e,a){return`select get_ddl('PROCEDURE', '${e}.${a}()') "Create Procedure";`}showFunctionSource(e,a){return`select get_ddl('FUNCTION', '${e}.${a}()') "Create Function";`}showColumns(e,a){return`SELECT 
        c.COLUMN_NAME "name",
        DATA_TYPE "type",
        CHARACTER_MAXIMUM_LENGTH "maximum_length",
        IS_IDENTITY "key",
        COMMENT "comment",
        IS_NULLABLE "nullable",
        COLUMN_DEFAULT "defaultValue",
        COLLATION_NAME "$"
        FROM information_schema.columns c
        WHERE c.table_schema = '${e}' AND c.table_name = '${a}' 
        ORDER BY c.ORDINAL_POSITION;`}showProcedures(e){return`SELECT PROCEDURE_NAME ROUTINE_NAME FROM information_schema.PROCEDURES WHERE PROCEDURE_SCHEMA = '${e}' ORDER BY PROCEDURE_NAME`}showFunctions(e){return`SELECT FUNCTION_NAME ROUTINE_NAME FROM INFORMATION_SCHEMA.FUNCTIONS WHERE FUNCTION_SCHEMA='${e}' ORDER BY FUNCTION_NAME`}showViews(e,a){return`SELECT COMMENT "comment",TABLE_NAME "name",ROW_COUNT "table_rows"
        FROM information_schema.TABLES  WHERE TABLE_SCHEMA = '${a}' and TABLE_TYPE='VIEW' ORDER BY TABLE_NAME;`}buildPageSql(e,a,t){return`SELECT * FROM ${a} LIMIT ${t};`}showTables(e,a){return`SELECT COMMENT "comment",TABLE_NAME "name",ROW_COUNT "table_rows"
        FROM information_schema.TABLES  WHERE TABLE_SCHEMA = '${a}' and TABLE_TYPE<>'VIEW' ORDER BY TABLE_NAME;`}showDatabases(){return"show databases;"}showSchemas(){return'SELECT SCHEMA_NAME "schema" FROM INFORMATION_SCHEMA.SCHEMATA;'}tableTemplate(){return`CREATE TABLE table_name$1(  
    id int NOT NULL PRIMARY KEY AUTOINCREMENT,
    create_time DATE,
    name$2 VARCHAR(255)
);
COMMENT ON TABLE table_name$1 IS '$3';
COMMENT ON COLUMN table_name$1.name$2 IS '$4';`}viewTemplate(){return`CREATE VIEW view_name$1
AS
SELECT * FROM $2`}procedureTemplate(){return`create procedure proc_name$1() returns string
language javascript
as $$
    $2return 1+1;
$$;`}functionTemplate(){return`CREATE FUNCTION fun_name$1() RETURNS int
AS
$$
    $2return 1;
$$`}showRoles(){return"SELECT ROLE_NAME FROM information_schema.applicable_roles ORDER BY ROLE_NAME;"}createRole(){return`CREATE ROLE role_name$1;
-- Grant role privileges
GRANT ROLE role_name$1 TO role role_name$2;`}updateRole(e){return`ALTER ROLE ${e} 
-- RENAME TO new_name
;`}grantRole(e){return`GRANT ROLE ${e} TO ROLE role_name$1;`}}class D extends i{showDatabases(){return null}showSchemas(e){return null}createDatabase(e){return null}updateTable(e){const{table:a,newTableName:t}=e;let n="";return t&&a!=t&&(n+=`ALTER TABLE ${a} RENAME TO ${t};`),n}showVersion(){return"select sqlite_version() as server_version"}updateColumn(e,a){return null}updateColumnSql(e){return null}createIndex(e){const{table:a,column:t="$2"}=e;return`CREATE INDEX ${`${a}_${t}`} ON ${a}(${t});`}showIndex(e,a){return`SELECT name index_name FROM sqlite_master WHERE type='index' and tbl_name='${a}' `}dropIndex(e,a){return`DROP INDEX ${a};`}showTables(e,a){return"SELECT name, type FROM sqlite_master WHERE type='table' ORDER BY type ASC, name ASC;"}addColumn(e,a){return`ALTER TABLE ${e} 
    ADD COLUMN $1 [type$2];`}showSequences(e){return"SELECT name,seq sequence FROM sqlite_sequence"}showColumns(e,a){return`SELECT t1.*,t1.pk "key",t1.dflt_value "defaultValue",t2."table" "referenced_table",t2."to" "referenced_column" FROM PRAGMA_TABLE_INFO('${a}') t1
        left join (
            SELECT * FROM  pragma_foreign_key_list('${a}')
        ) t2  on t1.name=t2.'from';`}showViews(e,a){return"SELECT name, type FROM sqlite_master WHERE type='view' AND name <> 'sqlite_sequence' AND name <> 'sqlite_stat1' ORDER BY type ASC, name ASC;"}showTriggers(e,a){return`SELECT name, tbl_name, sql FROM sqlite_master WHERE type='trigger' ${a?` AND tbl_name='${a}'`:""} ORDER BY name ASC;`}buildPageSql(e,a,t){return`SELECT * FROM ${a} LIMIT ${t};`}showTableSource(e,a){return`SELECT sql "Create Table" FROM sqlite_master where name='${a}' and type='table';`}showViewSource(e,a){return`SELECT sql "Create View" FROM sqlite_master where name='${a}' and type='view';`}showTriggerSource(e,a){return`SELECT sql FROM sqlite_master where name='${a}' and type='trigger';`}tableTemplate(){return`CREATE TABLE table_name$1(  
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    content TEXT
);`}viewTemplate(){return`CREATE VIEW view_name$1
AS
SELECT * FROM $2`}}class q extends D{showVersion(){return"SELECT library_version as server_version from pragma_version()"}pingDataBase(e,a){return e?`set schema '${e}';`:null}showDatabases(){return'SELECT DISTINCT catalog_name "Database" from information_schema.schemata ORDER BY catalog_name'}showSchemas(e){return`SELECT schema_name "schema" from information_schema.schemata WHERE catalog_name='${e}' ORDER BY schema_name`}showTables(e,a){return`SELECT table_name "name" FROM information_schema.tables
        WHERE table_type in ('BASE TABLE','LOCAL TEMPORARY') and table_catalog='${e}' and table_schema = '${a}' order by table_name`}showViews(e,a){return`
SELECT table_name "name",1 "view_group",null "source" FROM information_schema.tables
        WHERE table_type='VIEW' and table_catalog='${e}' and table_schema = '${a}'
        UNION all
SELECT viewname "name",2 "view_group",definition "source" FROM pg_catalog.pg_views
        WHERE schemaname = '${a}'
ORDER BY "view_group",name`}showSequences(e){return`SELECT sequence_name AS name, last_value AS sequence 
                FROM duckdb_sequences() 
                WHERE schema_name = '${e}'`}tableTemplate(){return`CREATE TABLE table_name$1(  
    id INTEGER NOT NULL PRIMARY KEY,
    content TEXT
);`}showColumns(e,a){return["system","temp"].includes(e)?`SELECT column_name "name", data_type "type",
        column_default "defaultValue", is_nullable "nullable"
        FROM information_schema.columns c
        WHERE c.table_schema = '${e}' AND c.table_name = '${a}' 
        ORDER BY c.ORDINAL_POSITION;`:`SELECT t1.*,t1.pk "key",t1.dflt_value "defaultValue" FROM PRAGMA_TABLE_INFO('${a}') t1;`}updateColumn(e,a){const{name:t,type:n}=a;return`-- change column type
ALTER TABLE ${e} 
    ALTER COLUMN ${t} TYPE ${n};
-- change column name
ALTER TABLE ${e} 
    RENAME COLUMN ${t} TO ${t};`}updateColumnSql(e){return new C(e).genAlterSQL()}}class f extends S{showVersion(){return"select version() as server_version;"}showDatabases(){return"show databases"}showTables(e,a){return`show tables in ${e}`}showColumns(e,a){return`describe ${e}.${a};`}showViews(e,a){return`show views in ${e}`}}class j extends S{showVersion(){return"SELECT node_version as server_version FROM system.runtime.nodes;"}pingDataBase(e){return e?`use ${e}`:null}showDatabases(){return"show catalogs"}}class J extends S{showVersion(){return"select release_version from system.local;"}showUsers(){return'SELECT role as "user" FROM system_auth.roles;'}pingDataBase(e){return e?`use ${e}`:null}createDatabase(e){return`CREATE KEYSPACE $1
WITH REPLICATION = { 
    'class' : 'SimpleStrategy', 
    'replication_factor' : 1 
};`}dropDatabase(e){return`DROP KEYSPACE ${e}`}showDatabases(){return'select keyspace_name as "database" from system_schema.keyspaces;'}showTables(e,a){return`select table_name as "name" from system_schema.tables where keyspace_name='${e}'`}showColumns(e,a){return`select column_name as "name", type, kind as "key" 
                from system_schema.columns 
                where keyspace_name='${e}' 
                and table_name='${a}'`}tableTemplate(){return`CREATE TABLE table_name$1(  
    id int PRIMARY key,
    create_time DATE,
    update_time DATE,
    content TEXT
);`}}class X extends C{otherPart(){const{oldRow:e,isAutoIncrement:a}=this.param;return!e.isAutoIncrement&&a?`${this.afterColumnPrefix} SET GENERATED ALWAYS as identity;`:e.isAutoIncrement&&!a?`${this.afterColumnPrefix} DROP GENERATED;`:null}commentPart(){const{oldRow:e,table:a,columnName:t,comment:n}=this.param;if(n!=e.comment)return`COMMENT ON COLUMN "${a}"."${t}" is '${n}';`}changeTypePart(){const{oldRow:e,columnType:a}=this.param;return e.type==a?"":`${this.afterColumnPrefix} SET DATA TYPE ${a};`}}class B extends S{showVersion(){return'SELECT SERVICE_LEVEL as "server_version" FROM SYSIBMADM.ENV_INST_INFO;'}showUsers(){return`SELECT GRANTEE "user" FROM syscat.dbauth WHERE GRANTEETYPE='U';`}pingDataBase(e){return e?`set SCHEMA ${e}`:null}showDatabases(){return'select schemaname "database" from syscat.schemata'}showTableSource(e,a){return null}showTables(e,a){return`select tabname "name", remarks "comment" from syscat.tables where tabschema='${a}' and TYPE='T' order by tabname`}showColumns(e,a){return`select COLUMN_NAME "name",
        DATA_TYPE "type",
        IS_NULLABLE "nullable",
        NUMERIC_PRECISION "precision",
        NUMERIC_SCALE "scale",
        CHARACTER_MAXIMUM_LENGTH "maximum_length",
        sc.length "number_length",
        COLUMN_DEFAULT "defaultValue",
        tc.TYPE "key",
        sc.remarks "comment",
        sc.IDENTITY "extra",
        r.REFTABNAME "referenced_table",
        trim(r.PK_COLNAMES) "referenced_column"
        from SYSIBM.columns c
        left join syscat.keycoluse kc
            on c.TABLE_SCHEMA=kc.TABSCHEMA and c.TABLE_NAME=kc.TABNAME  and c.COLUMN_NAME=kc.COLNAME
        left join SYSCAT.tabconst tc
            on c.TABLE_SCHEMA=tc.TABSCHEMA and c.TABLE_NAME=tc.TABNAME  and tc.CONSTNAME=kc.CONSTNAME
        left join sysibm.syscolumns sc
            on c.TABLE_SCHEMA=sc.TBCREATOR and c.TABLE_NAME=sc.TBNAME  and c.COLUMN_NAME=sc.NAME
        left join syscat.references r
            on c.TABLE_SCHEMA=r.TABSCHEMA and c.TABLE_NAME=r.TABNAME  and c.COLUMN_NAME=trim(r.FK_COLNAMES)
        where
            TABLE_SCHEMA = '${e}'
            and TABLE_NAME = '${a}'
        order by ORDINAL_POSITION;`}updateColumnSql(e){return new X(e).genAlterSQL()}showAllForeignKeys(){return`SELECT 
        CONSTNAME "constraint_name",
        TABSCHEMA "table_schema",
        TABNAME "table_name",
        FK_COLNAMES "column_name",
    REFTABNAME "referenced_table",
    PK_COLNAMES "referenced_column"
     FROM syscat.references`}showForeignKeys(e,a){return`SELECT 
        FK_COLNAMES "column_name",
        CONSTNAME "constraint_name",
        REFTABNAME "referenced_table",
        PK_COLNAMES "referenced_column",
        UPDATERULE "updateRule",
        DELETERULE "deleteRule"
         FROM syscat.references WHERE 
        TABSCHEMA='${e}' and TABNAME='${a}'`}showIndex(e,a){return`SELECT 
        COLNAMES "column_name",
        INDNAME "index_name",
        UNIQUERULE='U' "isUnique"
         FROM SYSCAT.INDEXES WHERE TABNAME = '${a}' AND TABSCHEMA = '${e}'`}showViews(e,a){return`select VIEWNAME "name",TEXT "source" from SYSCAT.VIEWS where VIEWSCHEMA = '${a}';`}showProcedures(e){return`select PROCNAME "routine_name",TEXT "source" from SYSCAT.procedures where PROCSCHEMA = '${e}' order by PROCNAME;`}showChecks(e,a){return`SELECT CONSTNAME "name",TEXT "clause" FROM SYSCAT.CHECKS WHERE TABNAME = '${a}' AND TABSCHEMA = '${e}';`}showTriggers(e,a){let t=`SELECT TRIGNAME "trigger_name",TEXT "source",TABNAME "table_name",TRIGEVENT "event" FROM syscat.triggers WHERE TABSCHEMA = '${e}'`;return a&&(t+=`AND TABNAME = '${a}'`),t}showFunctions(e){return`select FUNCNAME "routine_name",BODY "source" from SYSCAT.FUNCTIONS where FUNCSCHEMA = '${e}' order by FUNCNAME;`}dropIndex(e,a){return`DROP INDEX "${a}"`}createDatabase(e){return`CREATE SCHEMA ${e}$1;`}tableTemplate(){return`CREATE TABLE table_name$1(  
    id INTEGER NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    create_time DATE,
    update_time DATE,
    content VARCHAR(255)
);`}processList(){return`SELECT session_auth_id,
        application_handle,
        elapsed_time_sec,
        activity_state,
        rows_read,
        stmt_text info
 FROM sysibmadm.mon_current_sql
 ORDER BY elapsed_time_sec DESC`}}class K extends M{tableTemplate(){return`CREATE TABLE table_name(  
    id int NOT NULL  COMMENT 'Primary Key',
    create_time DATETIME COMMENT 'Create Time',
    name VARCHAR(255)
) 
AGGREGATE KEY(id,create_time,name)
DISTRIBUTED BY HASH(id) BUCKETS 1
PROPERTIES (
    "replication_allocation" = "tag.location.default: 1"
);`}showColumns(e,a){return`SELECT 
        c.COLUMN_NAME name,
        COLUMN_TYPE type,
        COLUMN_COMMENT comment,COLUMN_KEY \`key\`,IS_NULLABLE nullable,
        CHARACTER_MAXIMUM_LENGTH maximum_length,
        COLUMN_DEFAULT defaultValue,
        INSTR(COLUMN_TYPE,'zerofill')>0 "zerofill",
        INSTR(COLUMN_TYPE,'unsigned')>0 "unsigned",
        EXTRA extra,
        COLLATION_NAME collation_name,
        CHARACTER_SET_NAME character_set_name 
        FROM information_schema.columns c
        WHERE c.table_schema = '${e}' AND c.table_name = '${a}' 
        ORDER BY c.ORDINAL_POSITION;`}}class Q extends i{showVersion(){return"SELECT SERVER_VERSION();"}createIndex(e){let a=`${e.type||"key"}`;return a.match(/BTREE/i)&&(a="key"),`ALTER TABLE ${e.table} ADD ${a} (\`${e.column||"$1"}\`)`}dropIndex(e,a){return`ALTER TABLE ${e} DROP INDEX \`${a}\``}showIndex(e,a){return`SELECT column_name "column_name",index_name "index_name",index_type "index_type",non_unique=0 "isUnique" FROM INFORMATION_SCHEMA.STATISTICS WHERE table_schema='${e}' and table_name='${a}';`}addColumn(e,a){const t=a?` AFTER \`${a}\``:"";return`ALTER TABLE ${e} 
    ADD COLUMN $1 [type]$2 COMMENT '$3'${t};`}createUser(){return`CREATE USER '$1'@'%' IDENTIFIED BY 'password$2';
-- Grant select privilege to all databases;
GRANT SELECT ON *.* TO '$1'@'%' WITH GRANT OPTION;
-- Grant all privileges to all databases;
GRANT ALL PRIVILEGES ON *.* TO '$1'@'%' WITH GRANT OPTION;`}updateUser(e){return`update mysql.user set 
    password = PASSWORD("newPassword")
    where User = '${e}';
FLUSH PRIVILEGES;
-- since mysql version 5.7, password column need change to authentication_string=PASSWORD("newPassword")`}updateColumn(e,a){const{nullable:t,extra:n}=a;return this.updateColumnSql({table:e,...a,isNotNull:t!="YES",isAutoIncrement:n?.toLowerCase()?.includes?.("auto_increment")})}updateColumnSql(e){const{table:a,name:t,columnName:n=t,type:E,unsigned:r,zerofill:s,useCurrentTimestamp:o,isNotNull:c,isAutoIncrement:_,comment:A,defaultValue:m,character_set_name:R,collation_name:O}=e,d=!y(E)&&!E?.match(/json/i);return new u(`ALTER TABLE \`${a}\``).append(`
	CHANGE \`${n}\` \`${t}\` ${E}`).if(r=="1","UNSIGNED").if(s=="1","ZEROFILL").if(o,"ON UPDATE CURRENT_TIMESTAMP").if(d&&R,`CHARACTER SET ${R}`).if(d&&O,`COLLATE ${O}`).if(c,"NOT NULL").if(_,"AUTO_INCREMENT").if(A,`COMMENT '${A}'`).if(N(m)&&!c,"DEFAULT NULL").if(!N(m),`DEFAULT ${m=="CURRENT_TIMESTAMP"?m:`${L(m,E)}`}`).append(";").toString()}showCollations(){return null}pingDataBase(e){return e?`use \`${e}\``:null}updateTable(e){const{table:a,newTableName:t,comment:n,newComment:E,collation:r,newCollation:s}=e;let o="";return E&&E!=n&&(o=`ALTER TABLE \`${a}\` COMMENT = '${E}';`),s&&s!=r&&(o+=`ALTER TABLE \`${a}\` collate = '${s}';`),t&&a!=t&&(o+=`ALTER TABLE \`${a}\` RENAME TO \`${t}\`;`),o}truncateDatabase(e){return`SELECT Concat('TRUNCATE TABLE \`',table_schema,'\`.\`',TABLE_NAME, '\`;') trun FROM INFORMATION_SCHEMA.TABLES where  table_schema ='${e}' and TABLE_TYPE<>'VIEW';`}createDatabase(e){return"CREATE DATABASE $1;"}showTableSource(e,a){return`SHOW CREATE TABLE \`${e}\`.\`${a}\`;`}showPartitions(e,a){return`SELECT 
PARTITION_NAME "name",PARTITION_METHOD "strategy",PARTITION_EXPRESSION "columnName",
PARTITION_DESCRIPTION "value",TABLE_ROWS "rows",DATA_LENGTH "length"
        FROM information_schema.partitions WHERE TABLE_SCHEMA='${e}' AND TABLE_NAME = '${a}' AND PARTITION_NAME IS NOT NULL`}showViewSource(e,a){return`SHOW CREATE VIEW  \`${e}\`.\`${a}\`;`}showTriggerSource(e,a){return`SHOW CREATE TRIGGER \`${e}\`.\`${a}\`;`}showColumns(e,a){return`desc ${a}`}showForeignKeys(e,a){return`SELECT
        c.COLUMN_NAME column_name, ik.CONSTRAINT_NAME constraint_name,
        ik.REFERENCED_TABLE_NAME referenced_table, ik.REFERENCED_COLUMN_NAME referenced_column,
        UPDATE_RULE "updateRule",
        DELETE_RULE "deleteRule"
        FROM
        information_schema.columns c join information_schema.KEY_COLUMN_USAGE ik on c.table_schema = ik.TABLE_SCHEMA
        and c.table_name = ik.TABLE_NAME and c.COLUMN_NAME = ik.COLUMN_NAME
        JOIN information_schema.REFERENTIAL_CONSTRAINTS ir on ik.CONSTRAINT_NAME=ir.CONSTRAINT_NAME
        WHERE c.table_schema = '${e}' and c.table_name = '${a}' ORDER BY ik.CONSTRAINT_NAME;`}showViews(e){return`SELECT TABLE_NAME name,SECURITY_TYPE "view_group" FROM information_schema.VIEWS  WHERE TABLE_SCHEMA = '${e}' ORDER BY TABLE_NAME`}buildPageSql(e,a,t){return`SELECT * FROM ${a} LIMIT ${t};`}showTables(e){return`show ${e}.tables;`}showDatabases(){return"show databases"}showSchemas(){return this.showDatabases()}tableTemplate(e){return`CREATE TABLE table_name$1(  
    create_time timestamp,
    name$2 NCHAR(255)
);`}viewTemplate(){return`CREATE VIEW view_name$1
AS
SELECT * FROM $2`}procedureTemplate(){return`CREATE PROCEDURE proc_name$1()
BEGIN
$2
END;`}functionTemplate(){return`CREATE FUNCTION fun_name$1() RETURNS int$2
READS SQL DATA
BEGIN
    $3
    return 0;
END;`}}class z extends f{showVersion(){return""}}class Z extends S{showDatabases(){return"SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA ORDER BY SCHEMA_NAME;"}showTables(e,a=e){return`SELECT table_name,ddl source FROM ${a}.INFORMATION_SCHEMA.TABLES  WHERE TABLE_SCHEMA = '${a}' and TABLE_TYPE<>'VIEW' ORDER BY TABLE_NAME;`}showTableSource(e,a){return`SELECT ddl source FROM ${e}.INFORMATION_SCHEMA.TABLES  WHERE TABLE_SCHEMA = '${e}' and table_name='${a}' ORDER BY TABLE_NAME;`}showColumns(e,a){return`SELECT COLUMN_NAME name,DATA_TYPE type, IS_NULLABLE nullable 
            FROM ${e}.INFORMATION_SCHEMA.COLUMNS WHERE table_schema = '${e}' AND table_name = '${a}' ORDER BY ORDINAL_POSITION;`}showViews(e,a=e){return`SELECT TABLE_NAME,view_definition source FROM ${a}.INFORMATION_SCHEMA.VIEWS  WHERE TABLE_SCHEMA = '${a}' ORDER BY TABLE_NAME`}tableTemplate(e){return`CREATE TABLE ${e}.table_name$1(  
    id INT64,
    create_time DATE,
    update_time DATE,
    content STRING
);`}viewTemplate(){return`CREATE VIEW view_name$1
AS
SELECT * FROM `}createDatabase(e){return`CREATE SCHEMA ${e}$1;`}}class ee extends B{showVersion(){return"SELECT SYSTEM_VALUE_NAME, CURRENT_CHARACTER_VALUE FROM QSYS2.SYSTEM_VALUE_INFO WHERE SYSTEM_VALUE_NAME IN ('QSRLNBR', 'QMODEL');"}showUsers(){return`SELECT AUTHORIZATION_NAME AS "user" FROM QSYS2.USER_INFO WHERE STATUS = 'ENABLED';`}pingDataBase(e){return e?`SET SCHEMA ${e}`:null}showDatabases(){return'SELECT SCHEMA_NAME AS "database" FROM QSYS2.SYSSCHEMAS;'}showTables(e,a){return`SELECT TABLE_NAME AS "name", TABLE_TEXT AS "comment" FROM QSYS2.SYSTABLES WHERE TABLE_SCHEMA='${a}' AND TABLE_TYPE='T' ORDER BY TABLE_NAME;`}showColumns(e,a){return`SELECT COLUMN_NAME AS "name",
                       DATA_TYPE AS "type",
                       IS_NULLABLE AS "nullable",
                       NUMERIC_PRECISION AS "precision",
                       NUMERIC_SCALE AS "scale",
                       CHARACTER_MAXIMUM_LENGTH AS "maximum_length",
                       COLUMN_DEFAULT AS "defaultValue",
                       COLUMN_TEXT AS "comment",
                       IDENTITY AS "extra"
                FROM QSYS2.SYSCOLUMNS
                WHERE TABLE_SCHEMA = '${e}'
                  AND TABLE_NAME = '${a}'
                ORDER BY ORDINAL_POSITION;`}showAllForeignKeys(){return`SELECT 
                    CONSTRAINT_NAME AS "constraint_name",
                    TABLE_SCHEMA AS "table_schema",
                    TABLE_NAME AS "table_name",
                    CONSTRAINT_KEYS AS "column_name",
                    SYSTEM_TABLE_NAME AS "referenced_table",
                    SYSTEM_CONSTRAINT_SCHEMA AS "referenced_column"
                FROM QSYS2.SYSCST
                WHERE CONSTRAINT_TYPE = 'FOREIGN KEY';`}showForeignKeys(e,a){return`SELECT 
                    CONSTRAINT_KEYS AS "column_name",
                    CONSTRAINT_NAME AS "constraint_name",
                    SYSTEM_TABLE_NAME AS "referenced_table",
                    SYSTEM_CONSTRAINT_SCHEMA AS "referenced_column"
                FROM QSYS2.SYSCST
                WHERE TABLE_SCHEMA='${e}' AND TABLE_NAME='${a}' AND CONSTRAINT_TYPE='FOREIGN KEY';`}showIndex(e,a){return`SELECT 
                    INDEX_NAME AS "index_name",
                    COLUMN_NAME AS "column_name",
                    CASE WHEN NON_UNIQUE = 0 THEN 'YES' ELSE 'NO' END AS "isUnique"
                FROM QSYS2.SYSINDEXES
                WHERE TABLE_NAME = '${a}' AND TABLE_SCHEMA = '${e}';`}showViews(e,a){return`SELECT VIEW_NAME AS "name", VIEW_DEFINITION AS "source" FROM QSYS2.SYSVIEWS WHERE TABLE_SCHEMA = '${a}';`}showProcedures(e){return`SELECT SPECIFIC_NAME AS "routine_name", ROUTINE_DEFINITION AS "source" FROM QSYS2.SYSROUTINES WHERE ROUTINE_SCHEMA = '${e}' ORDER BY SPECIFIC_NAME;`}showChecks(e,a){return`SELECT CONSTRAINT_NAME AS "name", CHECK_CLAUSE AS "clause" FROM QSYS2.SYSCST WHERE TABLE_NAME = '${a}' AND TABLE_SCHEMA = '${e}' AND CONSTRAINT_TYPE = 'CHECK';`}showTriggers(e,a){return`SELECT TRIGGER_NAME AS "trigger_name", ACTION_STATEMENT AS "source", EVENT_OBJECT_TABLE AS "table_name", EVENT_MANIPULATION AS "event" FROM QSYS2.SYSTRIGGERS WHERE EVENT_OBJECT_SCHEMA = '${e}'${a?` AND EVENT_OBJECT_TABLE = '${a}'`:""};`}showFunctions(e){return`SELECT SPECIFIC_NAME AS "routine_name", ROUTINE_DEFINITION AS "source" FROM QSYS2.SYSFUNCS WHERE FUNCTION_SCHEMA = '${e}' ORDER BY SPECIFIC_NAME;`}dropIndex(e,a){return`DROP INDEX ${e}.${a};`}processList(){return`SELECT JOB_NAME, 
                       AUTHORIZATION_NAME, 
                       TOTAL_CPU_TIME, 
                       TOTAL_DISK_IO_COUNT, 
                       TOTAL_MEMORY_USAGE 
                FROM QSYS2.ACTIVE_JOB_INFO 
                ORDER BY TOTAL_CPU_TIME DESC;`}}class w extends M{showDatabases(){return"show databases"}showTables(e){return`show tables from ${e}`}showColumns(e,a){return`show columns from ${a}`}showViews(e){return`show views from ${e}`}showIndexes(e,a){return`show indexes from ${a}`}showFunctions(e){return`show functions from ${e}`}showProcedures(e){return`show procedures from ${e}`}showTriggers(e,a){return`show triggers from ${a}`}}class ae extends ${showVersion(){return"select replace(version(), 'KingbaseES ', '');"}triggerTemplate(e){return`CREATE TRIGGER trigger_name$1
[BEFORE/AFTER] INSERT ON ${e??"[table_name]$2"}
FOR EACH ROW BEGIN
    $3
END;`}}class te extends D{showDatabases(){return"list"}showTables(e){return`SELECT name, type FROM sqlite_master 
                WHERE type='table' 
                AND name NOT LIKE '_cf%' 
                ORDER BY type ASC, name ASC;`}}class ne extends p{showVersion(){return"SELECT VERSION() as server_version"}createIndex(e){return null}variableList(){return"SHOW ALL"}statusList(){return`SELECT
        'db_numbackends' AS db,
        pg_stat_get_db_numbackends(datid) AS status
      FROM
        pg_stat_database
      WHERE
        datname = current_database()
      UNION ALL
      SELECT
        'db_xact_commit',
        pg_stat_get_db_xact_commit(datid)
      FROM
        pg_stat_database
      WHERE
        datname = current_database()
      UNION ALL
      SELECT
        'db_xact_rollback',
        pg_stat_get_db_xact_rollback(datid)
      FROM
        pg_stat_database
      WHERE
        datname = current_database()
      UNION ALL
      SELECT
        'db_blocks_fetched',
        pg_stat_get_db_blocks_fetched(datid)
      FROM
        pg_stat_database
      WHERE
        datname = current_database()
      UNION ALL
      SELECT
        'db_blocks_hit',
        pg_stat_get_db_blocks_hit(datid)
      FROM
        pg_stat_database
      WHERE
        datname = current_database()`}processList(){return`SELECT
        a.pid AS "Id",
        a.usename AS "User",
        a.client_addr AS "Host",
        a.client_port AS "Port",
        datname AS "db",
        query AS "Command",
        l.mode AS "State",
        query_start AS "Time",
        CASE
          WHEN c.relname IS NOT NULL THEN 'Locked Object: ' || c.relname
          ELSE 'Locked Transaction: ' || l.virtualtransaction
        END AS "Info"
      FROM
        pg_stat_activity a
        LEFT JOIN pg_locks l ON a.pid = l.pid
        LEFT JOIN pg_class c ON l.relation = c.oid
      ORDER BY
        a.pid ASC,
        c.relname ASC`}addColumn(e,a){return`ALTER TABLE ${e}
  ADD COLUMN [column] [type];
COMMENT ON COLUMN ${e}.[column] IS 'comment';`}createUser(){return"CREATE USER [name] WITH PASSWORD 'password';"}updateUser(e){return`ALTER USER ${e} WITH PASSWORD 'new_password';`}updateColumn(e,a){const{name:t,type:n}=a;return`-- change column type
ALTER TABLE ${e}
    ALTER COLUMN ${t} TYPE ${n};
-- change column name
ALTER TABLE ${e}
    RENAME COLUMN ${t} TO ${t};`}updateColumnSql(e){return new b(e).genAlterSQL()}showUsers(){return'SELECT usename "user" from pg_user '}updateTable(e){const{table:a,newTableName:t,comment:n,newComment:E}=e;let r="";return E&&E!=n&&(r=`COMMENT ON TABLE "${a}" IS '${E}';`),t&&a!=t&&(r+=`ALTER TABLE "${a}" RENAME TO "${t}";`),r}truncateDatabase(e){return`SELECT Concat('TRUNCATE TABLE "',TABLE_NAME, '";') trun FROM INFORMATION_SCHEMA.TABLES WHERE  table_schema ='${e}' AND table_type='BASE TABLE';`}createDatabase(e){return"CREATE DATABASE $1"}showTableSource(e,a){return`SELECT pg_get_tabledef('${e}.${a}');`}showProcedureSource(e,a){return`select pg_get_functiondef('${e}.${a}' :: regproc) "Create Procedure",'${a}' "Procedure";`}showFunctionSource(e,a){return`select pg_get_functiondef('${e}.${a}' :: regproc) "Create Function",'${a}' "Function";`}showTriggerSource(e,a){return`select pg_get_triggerdef(oid) "SQL Original Statement",'${e}.${a}' "Trigger" from pg_trigger where tgname = '${a}';`}showPartitions(e,a){return""}showSequences(e){return`SELECT sequence_name name FROM information_schema.sequences WHERE sequence_schema = '${e}' ORDER BY sequence_name`}showTriggers(e,a){const t=a?` AND event_object_table='${a}'`:"";return`SELECT TRIGGER_NAME "trigger_name" FROM information_schema.TRIGGERS WHERE trigger_schema = '${e}' ${t} ORDER BY TRIGGER_NAME ASC`}showProcedures(e){return` SELECT proname AS "ROUTINE_NAME",
       pg_catalog.pg_get_function_arguments(p.oid) AS "argDefs"
FROM pg_catalog.pg_proc p
     LEFT JOIN pg_catalog.pg_namespace n ON n.oid = p.pronamespace
WHERE pg_catalog.pg_function_is_visible(p.oid)
  AND n.nspname = '${e}'
  AND p.prokind = 'p'; `}showFunctions(e){return`SELECT proname AS name,
       pg_catalog.pg_get_function_result(p.oid) AS return_type,
       pg_catalog.pg_get_function_arguments(p.oid) AS "argDefs",
       CASE
           WHEN p.proisagg THEN 'agg'
           WHEN p.proiswindow THEN 'window'
           WHEN p.prorettype = 'pg_catalog.trigger'::pg_catalog.regtype THEN 'trigger'
           ELSE 'normal'
       END AS type
FROM pg_catalog.pg_proc p
     LEFT JOIN pg_catalog.pg_namespace n ON n.oid = p.pronamespace
WHERE pg_catalog.pg_function_is_visible(p.oid)
  AND n.nspname = '${e}'
  AND p.prokind = 'f';  `}showTables(e,a){return`SELECT t.table_name "name", pg_catalog.obj_description(pgc.oid, 'pg_class') "comment",
    pg_total_relation_size(quote_ident(table_name)) AS "data_length"
FROM information_schema.tables t
JOIN pg_catalog.pg_class pgc ON t.table_name = pgc.relname
JOIN pg_catalog.pg_namespace pgn ON pgn.oid=pgc.relnamespace and pgn.nspname=t.table_schema
WHERE t.table_type='BASE TABLE'
AND t.table_schema='${a}' order by t.table_name;`}showSchemas(){return'SELECT nspname "schema" from pg_catalog.pg_namespace order by nspname ASC;'}tableTemplate(){return`CREATE TABLE table_name$1(  
    id serial NOT NULL PRIMARY KEY,
    create_time DATE,
    name$2 VARCHAR(255)
);
COMMENT ON TABLE table_name$1 IS '$3';
COMMENT ON COLUMN table_name$1.name$2 IS '$4';`}procedureTemplate(){return`CREATE OR REPLACE PROCEDURE procedure_name()
AS
BEGIN
   SELECT 1;
END;`}functionTemplate(){return`CREATE FUNCTION function_name()
RETURNS int STABLE
AS $$
    SELECT 1
$$ LANGUAGE sql;`}}class Ee extends S{showVersion(){return"select version() as server_version;"}showDatabases(){return"SHOW CATALOGS"}pingDataBase(e,a){return`USE ${e}`}showTables(e,a){return`SELECT table_name FROM information_schema.tables
   WHERE table_catalog = '${e}' and table_schema = '${a}' and TABLE_TYPE<>'VIEW' `}tableTemplate(){return`CREATE TABLE table_name$1(
    id LONG PRIMARY KEY,
    create_time DATE,
    update_time DATE,
    content STRING
);`}showColumns(e,a){return`SELECT c.COLUMN_NAME name,
c.DATA_TYPE type, c.IS_NULLABLE nullable,
CASE WHEN tc.constraint_type = 'PRIMARY KEY' THEN 'YES' ELSE 'NO' END AS key
    FROM information_schema.columns c
    LEFT JOIN 
        information_schema.key_column_usage kcu ON c.table_schema = kcu.table_schema
        AND c.table_name = kcu.table_name AND c.column_name = kcu.column_name
    LEFT JOIN 
        information_schema.table_constraints tc ON kcu.constraint_name = tc.constraint_name
        AND kcu.table_schema = tc.table_schema AND kcu.table_name = tc.table_name
    WHERE c.table_schema = '${e}' AND c.table_name = '${a}'
    ORDER BY c.ordinal_position;`}createDatabase(e){return`CREATE CATALOG $1${e};`}dropDatabase(e){return`DROP CATALOG ${e};`}}class re extends p{showTables(e,a){return`SELECT t.table_name "name", pg_catalog.obj_description(pgc.oid, 'pg_class') "comment",pgc.reltuples "table_rows"
FROM information_schema.tables t
JOIN pg_catalog.pg_class pgc ON t.table_name = pgc.relname 
JOIN pg_catalog.pg_namespace pgn ON pgn.oid=pgc.relnamespace and pgn.nspname=t.table_schema
WHERE t.table_type='BASE TABLE'
AND t.table_schema='${a}' order by t.table_name;`}processList(){return`SELECT
            a.pid AS "ID",
            query_start AS "Time",
            datname AS "db",
            CASE
            WHEN c.relname IS NOT NULL THEN c.relname
            ELSE l.virtualtransaction
            END AS "Target",
            l.mode AS "State",
            query AS "SQL"
          FROM
            pg_stat_activity a
            LEFT JOIN pg_locks l ON a.pid = l.pid
            LEFT JOIN pg_class c ON l.relation = c.oid
          ORDER BY
            a.pid ASC,
            c.relname ASC`}statusList(){return null}}class se extends S{showVersion(){return"SELECT PARAM_VALUE FROM EXA_METADATA WHERE PARAM_NAME = 'databaseProductVersion';"}showDatabases(){return"SELECT SCHEMA_NAME FROM EXA_SCHEMAS ORDER BY SCHEMA_NAME;"}showTables(e,a,t){return`SELECT TABLE_NAME FROM SYS.EXA_ALL_TABLES WHERE TABLE_SCHEMA = '${a}' ORDER BY TABLE_NAME;`}showViews(e,a){return`SELECT VIEW_NAME FROM SYS.EXA_ALL_VIEWS WHERE VIEW_SCHEMA = '${a}' ORDER BY VIEW_NAME;`}pingDataBase(e){return e?`OPEN SCHEMA ${e};`:null}showColumns(e,a,t){return`SELECT 
            COLUMN_NAME as "name",
            COLUMN_TYPE as "type",
            COLUMN_IS_NULLABLE as "nullable",
            CASE WHEN COLUMN_IS_DISTRIBUTION_KEY = 'TRUE' THEN 'YES' ELSE 'NO' END as "key"
        FROM EXA_ALL_COLUMNS 
        WHERE COLUMN_SCHEMA = '${e}' 
        AND COLUMN_TABLE = '${a}'
        ORDER BY COLUMN_ORDINAL_POSITION;`}showTriggers(e,a){return`SELECT TRIGGER_NAME FROM SYS.EXA_ALL_TRIGGERS WHERE TRIGGER_SCHEMA = '${e}' ORDER BY TRIGGER_NAME;`}showProcedures(e){return""}showFunctions(e){return`SELECT FUNCTION_NAME FROM SYS.EXA_ALL_FUNCTIONS WHERE FUNCTION_SCHEMA = '${e}' ORDER BY FUNCTION_NAME;`}tableTemplate(){return`CREATE TABLE table_name (
    id INTEGER IDENTITY PRIMARY KEY,
    name VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`}viewTemplate(){return`CREATE VIEW view_name$1
AS
SELECT * FROM $2`}procedureTemplate(){return`CREATE PROCEDURE procedure_name(IN param1 INTEGER)
AS
BEGIN
    -- Procedure logic here
END;`}functionTemplate(){return`CREATE FUNCTION function_name$1(param1 INTEGER)
RETURNS INTEGER AS
BEGIN
    $3
    -- Function logic here
    RETURN 0;
END;`}triggerTemplate(){return`CREATE TRIGGER trigger_name
BEFORE INSERT ON table_name
FOR EACH ROW
BEGIN
    -- Trigger logic here
END;`}showUsers(){return'SELECT USER_NAME "user" FROM SYS.EXA_ALL_USERS ORDER BY USER_NAME;'}userTemplate(){return"CREATE USER user_name IDENTIFIED BY 'password';"}truncateDatabase(e){return`SELECT 'TRUNCATE TABLE ' || TABLE_SCHEMA || '.' || TABLE_NAME || ';' 
        FROM SYS.EXA_ALL_TABLES 
        WHERE TABLE_SCHEMA = '${e}';`}createUser(){return"CREATE USER user_name IDENTIFIED BY 'password';"}updateUser(){return"ALTER USER user_name IDENTIFIED BY 'new_password';"}grantPrivileges(){return"GRANT privileges ON schema_name.* TO user_name;"}updateColumn(){return"ALTER TABLE table_name MODIFY column_name column_type;"}addColumn(){return"ALTER TABLE table_name ADD column_name column_type;"}buildPageSql(e,a,t){return`SELECT * FROM ${a} LIMIT ${t}`}countSql(e,a){return`SELECT COUNT(1) as count FROM ${a}`}updateTable(){return"ALTER TABLE old_table_name RENAME TO new_table_name"}showTableSource(e,a){return`SELECT COLUMN_NAME, COLUMN_TYPE, COLUMN_DEFAULT, 
            CASE WHEN COLUMN_IS_NULLABLE = 'YES' THEN 'NULL' ELSE 'NOT NULL' END as nullable,
            COLUMN_COMMENT
        FROM SYS.EXA_ALL_COLUMNS 
        WHERE COLUMN_SCHEMA = '${e}' 
        AND COLUMN_TABLE = '${a}' 
        ORDER BY COLUMN_ORDINAL_POSITION`}showViewSource(e,a,t){return`SELECT VIEW_TEXT 
        FROM SYS.EXA_ALL_VIEWS 
        WHERE VIEW_SCHEMA = '${e}' 
        AND VIEW_NAME = '${a}'`}showProcedureSource(e,a){return`SELECT PROCEDURE_TEXT 
        FROM SYS.EXA_ALL_PROCEDURES 
        WHERE PROCEDURE_SCHEMA = '${e}' 
        AND PROCEDURE_NAME = '${a}'`}showFunctionSource(e,a){return`SELECT FUNCTION_TEXT 
        FROM SYS.EXA_ALL_FUNCTIONS 
        WHERE FUNCTION_SCHEMA = '${e}' 
        AND FUNCTION_NAME = '${a}'`}showTriggerSource(e,a){return`SELECT TRIGGER_TEXT 
        FROM SYS.EXA_ALL_TRIGGERS 
        WHERE TRIGGER_SCHEMA = '${e}' 
        AND TRIGGER_NAME = '${a}'`}processList(){return`SELECT SESSION_ID, USER_NAME, ACTIVITY, COMMAND_NAME, DURATION 
        FROM SYS.EXA_DBA_SESSIONS 
        WHERE STATUS = 'RUNNING'`}variableList(){return`SELECT PARAM_NAME, PARAM_VALUE 
        FROM SYS.EXA_PARAMETERS 
        ORDER BY PARAM_NAME`}statusList(){return`SELECT 'RUNNING' as status, 
        current_timestamp as server_time, 
        current_schema as current_database`}createDatabase(){return"CREATE SCHEMA $1"}}function ce(l,e){switch(l||(l=T.MYSQL),l){case T.MYSQL:return e?new w:new M;case T.MARIA_DB:return new W;case T.DORIS:return new K;case T.MYSQL_COMPATIBLE:return new w;case T.KINGBASE:return new ae;case T.COCKROACH:return new re;case T.PG:return e?new p:new $;case T.REDSHIFT:return new v;case T.GAUSS_DB:return new ne;case T.SQLServer:return new x;case T.D1:return new te;case T.libSQL:case T.SQLITE:return new D;case T.DUCK_DB:return new q;case T.SNOWFLAKE:return new k;case T.CLICKHOUSE:return new P;case T.DM:return new Y;case T.ORACLE:return new U;case T.CASSANDRA:return new J;case T.BIG_QUERY:return new Z;case T.PRESTO:case T.TRINO:return new j;case T.HIVE:return new f;case T.DATABRICKS:return new Ee;case T.ATHENA:return new z;case T.DB2:return new B;case T.AS400:return new ee;case T.MONGO_DB:return new G;case T.NEO4J:return new V;case T.TDengine:return new Q;case T.EXASOL:return new se}return new S}export{ce as g};
