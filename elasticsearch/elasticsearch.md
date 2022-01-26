## 入门使用

### 基本概念

#### 索引（index）

类似的数据放在一个索引中，一个索引可以理解成一个关系型数据库

#### 类型（type）

代表document属于index中的那个类比，也有比作关系型数据库的表的一种说法

es5中一个index可以有多种type

es6中一个index只能有一种type

es7以后要逐渐移除type概念

#### 映射（mapping）

定义了每个字段类型等信息，类似于关系型数据中的表结构

常用数据类型：text、keyword、number、array、range、boolean、date、geo_point、ip、nested、object

### 索引操作

> 创建索引

```javascript
PUT /索引名
```

> 查询索引是否存在

```javascript
HEAD /索引名
```

> 获取索引

```
GET /索引名
GET /索引名，索引名
```

> 删除索引

```javascript
DELETE /索引名
DELETE /索引名，索引名
```

> 打开关闭索引

```
POST /索引名/_close
POST /索引名/_open
```

### 字段映射

> 创建字段映射

```javascript
PUT /索引名/_mapping
{
    "properties":{
        "字段名":{
            "type":"类型",
             "index":true,
             "store":true,
             "analyzer":"分词器"
        }
    }
}
```

type：字段类型

- String类型，又分两种：
  - text：可分词，不可参与聚合
  - keyword：不可分词，数据会作为完整字段进行匹配，可以参与聚合

- Numerical：数值类型，分两类
  - 基本数据类型：long、interger、short、byte、double、float、half_float
  - 浮点数的高精度类型：scaled_float

- Date：日期类型

  - elasticsearch可以对日期格式化为字符串存储，但是建议我们存储为毫秒值，存储为long，节省 空间。

- Array：数组类型

  - 进行匹配时，任意一个元素满足，都认为满足
  - 排序时，如果升序则用数组中的最小值来排序，如果降序则用数组中的最大值来排序

- Object：对象

  ```json
  {
  	name:"Jack",
  	age:21,
  	girl:{
  		name: "Rose",
          age:21
  	}
  }
  
  ```

  如果存储到索引库的是对象类型，例如上面的girl，会把girl变成两个字段：girl.name和girl.age

index：

index影响字段的索引情况。

- true：字段会被索引，则可以用来进行搜索。默认值就是true
- false：字段不会被索引，不能用来搜索

store：

是否将数据进行独立存储。

原始的文本会存储在 _source 里面，默认情况下其他提取出来的字段都不是独立存储的，是从 _source 里面提取出来的。当然你也可以独立的存储某个字段，只要设置store:true即可，获取独立存 储的字段要比从_source中解析快得多，但是也会占用更多的空间，所以要根据实际业务需求来设置， 默认为false

analyzer：指定分词器

一般我们处理中文会选择ik分词器 ik_max_word ik_smart

> 查看索引映射

```json
GET /索引名/_mapping
GET /_mapping
```

> 修改索引

```json
PUT /索引库名/_mapping
{
	"properties": {
		"字段名": {
			"type": "类型",
			"index": true，
			"store": true，
			"analyzer": "分词器"
		}
	}
}
```

注意:修改映射增加字段 做其它更改只能删除索引 重新建立映射

> 一次性创建索引和映射

```json
PUT /索引库名称
{
	"settings":{
		"索引库属性名":"索引库属性值"
	},
	"mappings":{
		"properties":{
			"字段名":{
			"映射属性名":"映射属性值"
			}
		}
	}
}
```



### 文档操作

> 新增文档

```json
POST /索引名称/_doc/{id}
{
	"field":"value"
}

POST /索引名称/_doc
{
	"field":"value"
}
```

> 查看文档

```javascript
GET /索引名称/_doc/{id}
GET /索引名/_search
```

|元数据项| 含义 |
|--|--|
|_index| document所属index |
|_type| document所属type，Elasticsearch7.x默认type为_doc |
|_id| 代表document的唯一标识，与index和type一起，可以唯一标识和定位一个 document _version document的版本号，Elasticsearch利用_version (版本号)的方式来确保应用 中相互冲突的变更不会导致数据丢失。需要修改数据时，需要指定想要修改文 档的version号，如果该版本不是当前版本号，请求将会失败 |
|_seq_no |严格递增的顺序号，每个文档一个，Shard级别严格递增，保证后写入的Doc seq_no大于先写入的Doc的seq_no |
|_primary_term |任何类型的写操作，包括index、create、update和Delete，都会生成一个 _seq_no。 |
|found |true/false，是否查找到文档 |
|_source| 存储原始文档|

> _source定制返回结果

```
GET /index/_doc/1?_source=name
```

> 更新文档（全部更新）

id对应文档存在，则修改

id对应文档不存在，则新增

```
PUT /索引名称/_doc/id
{
	"field":"value"
}
```

> 更新文档（局部更新）

```
POST /索引名/_update/{id}
{
	"doc":{
		"field":"value"
	}
}

```



> 删除文档

```javascript
DELETE /索引名/_doc/{id}
```

> 删除文档

- 根据id进行删除：

```javascript
DELETE /索引名/_doc/id
```

- 根据查询条件进行删除

```
POST /索引库名/_delete_by_query
{
	"query": {
		"match": {
			"字段名": "搜索关键字"
		}
	}
}

```

- 删除所有文档

```
POST 索引名/_delete_by_query
{
	"query": {
		"match_all": {}
	}
}

```

## 高级应用

### Query DSL

> 基本语法

```
POST /索引库名/_search
{
	"query":{
		"查询类型":{
			"查询条件":"查询条件值"
		}
	}
}

```

这里的query代表一个查询对象，里面可以有不同的查询属性

- 查询类型：

  例如： match_all ， match ， term ， range 等等

- 查询条件：查询条件会根据类型的不同，写法也有差异，后面详细讲解

#### 查询所有(match_all query)

```shell
POST /索引库名/_search
{
	"query":{
		"match_all": {}
	}
}
```

> 结果

- took：查询花费时间，单位是毫秒
- time_out：是否超时
- _shards：分片信息
- hits：搜索结果总览对象
  - total：搜索到的总条数
  - max_score：所有结果中文档得分的最高分
  - hits：搜索结果的文档对象数组，每个元素是一条搜索到的文档信息
    - _index：索引库 
    - _type：文档类型
    -  _id：文档id 
    - _score：文档得分 
    - _source：文档的源数据

#### 全文搜索(full-text query)

全文搜索能够搜索已分析的文本字段，如电子邮件正文，商品描述等。使用索引期间应用于字段的同一 分析器处理查询字符串。全文搜索的分类很多 几个典型的如下:

#####  匹配搜索(match query)

全文查询的标准查询，它可以对一个字段进行模糊、短语查询。 match queries 接收 text/numerics/dates, 对它们进行分词分析, 再组织成一个boolean查询。可通过operator 指定bool组 合操作（or、and 默认是 or ）。

- or关系

  match 类型查询，会把查询条件进行分词，然后进行查询,多个词条之间是or的关系

  ```json
  POST /lagou-property/_search
  {
  	"query":{
  		"match":{
  			"title":"华为电视"
  		}
  	}
  }
  
  ```

  在上面的案例中，不仅会查询到电视，而且与华为相关的都会查询到，多个词之间是 or 的关系。

- and关系

  某些情况下，我们需要更精确查找，我们希望这个关系变成 and ，可以这样做：

  ```json
  POST /lagou-property/_search
  {
      "query": {
          "match": {
              "title": {
                  "query": "华为电视",
                  "operator": "and"
              }
          }
      }
  }
  
  ```

  本例中，只有同时包含 华为 和 电视 的词条才会被搜索到。

##### 短语搜索(match phrase query)

match_phrase 查询用来对一个字段进行短语查询，可以指定 analyzer、slop移动因子

```json
POST /lagou-property/_search
{
    "query": {
        "match_phrase": {
            "title": "华为电视"
        }
    }
}
```

##### query_string 查询

Query String Query提供了无需指定某字段而对文档全文进行匹配查询的一个高级查询,同时可以指定在 哪些字段上进行匹配。

```json
# 默认 和 指定字段
GET /lagou-property/_search
{
    "query": {
        "query_string" : {
            "query" : "2699"
        }
    }
}
GET /lagou-property/_search
{
    "query": {
        "query_string" : {
            "query" : "2699",
            "default_field" : "title"
        }
    }
}
# 逻辑查询
GET /lagou-property/_search
{
    "query": {
        "query_string" : {
            "query" : "手机 OR 小米",
            "default_field" : "title"
        }
    }
}
GET /lagou-property/_search
{
    "query": {
        "query_string" : {
            "query" : "手机 AND 小米",
            "default_field" : "title"
        }
    }
}
# 模糊查询
GET /lagou-property/_search
{
    "query": {
        "query_string" : {
            "query" : "大米~1",
            "default_field" : "title"
        }
    }
}
# 多字段支持
GET /lagou-property/_search
{
    "query": {
        "query_string" : {
            "query":"2699",
            "fields": [ "title","price"]
        }
    }
}
```

##### 多字段匹配搜索(multi match query)

如果你需要在多个字段上进行文本搜索，可用multi_match 。multi_match在 match的基础上支持对多 个字段进行文本查询。

```json
GET /lagou-property/_search
{
    "query": {
        "multi_match" : {
            "query":"2699",
            "fields": [ "title","price"]
        }
    }
}
```

还可以使用*匹配多个字段：

```json
GET /lagou-property/_search
{
    "query": {
        "multi_match" : {
            "query":"http://image.lagou.com/12479622.jpg",
            "fields": [ "title","ima*"]
        }
    }
}

```

#### 词条级搜索(term-level queries)

##### 词条搜索(term query)

term 查询用于查询指定字段包含某个词项的文档

```json
POST /book/_search
{
    "query": {
        "term" : { "name" : "solr" }
    }
}
```

##### 词条集合搜索(terms query)

```json
GET /book/_search
{
    "query": {
        "terms" : { "name" : ["solr", "elasticsearch"]}
    }
}
```

#####  范围搜索(range query)

- gte：大于等于
-  gt：大于
-  lte：小于等于 
- lt：小于 
- boost：查询权重

```json
GET /book/_search
{
    "query": {
        "range" : {
            "price" : {
                "gte" : 10,
                "lte" : 200,
                "boost" : 2.0
            }
        }
    }
}
GET /book/_search
{
    "query": {
        "range" : {
            "timestamp" : {
                "gte" : "now-2d/d",
                "lt" : "now/d"
            }
        }
    }
}
GET book/_search
{
    "query": {
        "range" : {
            "timestamp" : {
                "gte": "18/08/2020",
                "lte": "2021",
                "format": "dd/MM/yyyy||yyyy"
            }
        }
    }
}
```

##### 不为空搜索(exists query)

```json
GET /book/_search
{
    "query": {
        "exists" : { "field" : "price" }
    }
}

```

##### 词项前缀搜索(prefix query)

```json
GET /book/_search
{ 
    "query": {
        "prefix" : { "name" : "so" }
    }
}

```

##### 通配符搜索(wildcard query)

```json
GET /book/_search
{
    "query": {
        "wildcard" : { "name" : "so*r" }
    }
}
GET /book/_search
{
    "query": {
        "wildcard": {
            "name": {
                "value": "lu*",
                "boost": 2
            }
        }
    }
}
```

##### 正则搜索(regexp query)

regexp允许使用正则表达式进行term查询.注意regexp如果使用不正确，会给服务器带来很严重的性能 压力。比如.*开头的查询，将会匹配所有的倒排索引中的关键字，这几乎相当于全表扫描，会很慢。因 此如果可以的话，最好在使用正则前，加上匹配的前缀。

```json
GET /book/_search
{
    "query": {
        "regexp":{
            "name": "s.*"
        }
    }
}
GET /book/_search
{
    "query": {
        "regexp":{
            "name":{
                "value":"s.*",
                "boost":1.2
            }
        }
    }
}
```

##### 模糊搜索(fuzzy query)

```json
GET /book/_search
{
    "query": {
        "fuzzy" : { "name" : "so" }
    }
}
GET /book/_search
{
    "query": {
        "fuzzy" : {
            "name" : {
                "value": "so",
                "boost": 1.0,
                "fuzziness": 2
            }
        }
    }
}
GET /book/_search
{
    "query": {
        "fuzzy" : {
            "name" : {
                "value": "sorl",
                "boost": 1.0,
                "fuzziness": 2
            }
        }
    }
}
```

#####  ids搜索(id集合查询)

```json
GET /book/_search
{
    "query": {
        "ids" : {
            "type" : "_doc",
            "values" : ["1", "3"]
        }
    }
}
```

#### 复合搜索(compound query)

##### constant_score query

用来包装另一个查询，将查询匹配的文档的评分设为一个常值

```json
GET /book/_search
{
    "query": {
        "term" : { "description" : "solr"}
    }
}
GET /book/_search
{
    "query": {
        "constant_score" : {
            "filter" : {
                "term" : { "description" : "solr"}
            },
            "boost" : 1.2
        }
    }
}
```

##### 布尔搜索(bool query)

bool 查询用bool操作来组合多个查询字句为一个查询。 可用的关键字： 

- must：必须满足 
- filter：必须满足，但执行的是filter上下文，不参与、不影响评分 
- should：或 
- must_not：必须不满足，在filter上下文中执行，不参与、不影响评分

```json
POST /book/_search
{
    "query": {
        "bool" : {
            "must" : {
                "match" : { "description" : "java" }
            },
            "filter": {
                "term" : { "name" : "solr" }
            },
            "must_not" : {
                "range" : {
                    "price" : { "gte" : 200, "lte" : 300 }
                }
            },
            "minimum_should_match" : 1,
            "boost" : 1.0
        }
    }
}
```

minimum_should_match代表了最小匹配精度，如果设置minimum_should_match=1，那么should 语句中至少需要有一个条件满足。

#### 排序

- 相关性评分排序

  默认情况下，返回的结果是按照 相关性 进行排序的——最相关的文档排在最前。 在本章的后面部 分，我们会解释 相关性 意味着什么以及它是如何计算的， 不过让我们首先看看 sort 参数以及如 何使用它。 为了按照相关性来排序，需要将相关性表示为一个数值。在 Elasticsearch 中， 相关性得分 由一 个浮点数进行表示，并在搜索结果中通过 _score 参数返回， 默认排序是 _score 降序，按照相 关性评分升序排序如下

  ```json
  POST /book/_search
  {
      "query": {
          "match": {"description":"solr"}
      }
  }
  POST /book/_search
  {
      "query": {
          "match": {"description":"solr"}
      },
      "sort": [
          {
              "_score": {"order": "asc"}
          }
      ]
  }
  ```

- 字段值排序

  ```json
  POST /book/_search
  {
      "query": {
          "match_all": {}
      },
      "sort": [
          {"price": {"order": "desc"}}
      ]
  }
  ```

- 多级排序

  假定我们想要结合使用 price和 _score（得分） 进行查询，并且匹配的结果首先按照价格排序， 然后按照相关性得分排序：

  ```json
  POST /book/_search
  {
      "query":{
          "match_all":{}
      },
      "sort": [
          { "price": { "order": "desc" }},
          { "timestamp": { "order": "desc" }}
      ]
  }
  ```

#### 分页

```json
POST /book/_search
{
    "query": {
        "match_all": {}
    },
    "size": 2,
    "from": 0
}
POST /book/_search
{
    "query": {
        "match_all": {}
    },
    "sort": [
        {"price": {"order": "desc"}}
    ],
    "size": 2,
    "from": 2
}
```

- size:每页显示多少条 
- from:当前页起始索引, int start = (pageNum - 1) * size

#### 高亮

```json
POST /book/_search
{
    "query": {
        "match": {
            "name": "elasticsearch"
        }
    },
    "highlight": {
        "pre_tags": "<font color='pink'>",
        "post_tags": "</font>",
        "fields": [{"name":{}},{"description":{}}]
    }
}
POST /book/_search
{
    "query": {
        "query_string" : {
            "query" : "elasticsearch"
        }
    },
    "highlight": {
        "pre_tags": "<font color='pink'>",
        "post_tags": "</font>",
        "fields": [{"name":{}},{"description":{}}]
    }
}
```

在使用match查询的同时，加上一个highlight属性： 

- pre_tags：前置标签
-  post_tags：后置标签
-  fields：需要高亮的字段 
  - name：这里声明title字段需要高亮，后面可以为这个字段设置特有配置，也可以空
