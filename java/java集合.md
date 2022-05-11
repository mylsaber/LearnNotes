## 集合概览

Java 集合， 也叫作容器，主要是由两大接口派生而来：一个是 `Collection`接口，主要用于存放单一元素；另一个是 `Map` 接口，主要用于存放键值对。对于`Collection` 接口，下面又有三个主要的子接口：`List`、`Set` 和 `Queue`。

![](https://gitee.com/mylsaber/learn-notes/raw/master/java%E5%9F%BA%E7%A1%80/images/1.png)

## 集合框架底层数据结构总结

### List

- `Arraylist`： `Object[]` 数组
- `Vector`：`Object[]` 数组
- `LinkedList`： 双向链表(JDK1.6 之前为循环链表，JDK1.7 取消了循环)

#### Set

- `HashSet`(无序，唯一): 基于 `HashMap` 实现的，底层采用 `HashMap` 来保存元素
- `LinkedHashSet`: `LinkedHashSet` 是 `HashSet` 的子类，并且其内部是通过 `LinkedHashMap` 来实现的。有点类似于我们之前说的 `LinkedHashMap` 其内部是基于 `HashMap` 实现一样，不过还是有一点点区别的
- `TreeSet`(有序，唯一): 红黑树(自平衡的排序二叉树)

#### Queue

- `PriorityQueue`: `Object[]` 数组来实现二叉堆
- `ArrayQueue`: `Object[]` 数组 + 双指针

#### Map

- `HashMap`： JDK1.8 之前 `HashMap` 由数组+链表组成的，数组是 `HashMap` 的主体，链表则是主要为了解决哈希冲突而存在的（“拉链法”解决冲突）。JDK1.8  以后在解决哈希冲突时有了较大的变化，当链表长度大于阈值（默认为 8）（将链表转换成红黑树前会判断，如果当前数组的长度小于  64，那么会选择先进行数组扩容，而不是转换为红黑树）时，将链表转化为红黑树，以减少搜索时间
- `LinkedHashMap`： `LinkedHashMap` 继承自 `HashMap`，所以它的底层仍然是基于拉链式散列结构即由数组和链表或红黑树组成。另外，`LinkedHashMap` 在上面结构的基础上，增加了一条双向链表，使得上面的结构可以保持键值对的插入顺序。同时通过对链表进行相应的操作，实现了访问顺序相关逻辑。
- `Hashtable`： 数组+链表组成的，数组是 `Hashtable` 的主体，链表则是主要为了解决哈希冲突而存在的
- `TreeMap`： 红黑树（自平衡的排序二叉树）

## List和Set集合详解

- 有序性
  - list保证插入顺序
  - set不保证插入顺序
- 唯一性
  - list可以重复
  - set不能重复
- 获取元素
  - list可以通过索引获取元素
  - set不能通过索引获取

### List的实现类

- **ArrayList**：底层数据结构是数组，查询快，增删慢，线程不安全，效率高，可以存储重复元素
- **LinkedList：** 底层数据结构是链表，查询慢，增删快，线程不安全，效率高，可以存储重复元素
- **Vector**:底层数据结构是数组，查询快，增删慢，线程安全，效率低，可以存储重复元素

List特有方法

```java
public void add(int index, E element);
public E remove(int index);
public E set(int index, E element);
public int indexOf(Object o); //元素第一次出现位置
public E get(int index);
public ListIterator<E> listIterator(); // 列表迭代器
public List<E> subList(int fromIndex, int toIndex);  //截取集合
```

### Set实现类

- **HashSet**：底层数据结构采用哈希表实现，元素无序且唯一，线程不安全，效率高，可以存储null元素，**元素的唯一性是靠所存储元素类型是否重写hashCode()和equals()方法来保证的**，如果没有重写这两个方法，则无法保证元素的唯一性。
- **LinkedHashSet**：底层数据结构采用链表和哈希表共同实现，链表保证了元素的顺序与存储顺序一致，哈希表保证了元素的唯一性。线程不安全，效率高。
- **TreeSet**：底层数据结构采用红黑树来实现，元素唯一且已经排好序；唯一性同样需要重写hashCode和equals()方法，二叉树结构保证了元素的有序性。根据构造方法不同，分为自然排序（无参构造）和比较器排序（有参构造），自然排序要求元素必须实现Compareable接口，并重写里面的compareTo()方法，元素通过比较返回的int值来判断排序序列，返回0说明两个对象相同，不需要存储；比较器排序需要在TreeSet初始化是时候传入一个实现Comparator接口的比较器对象，或者采用匿名内部类的方式new一个Comparator对象，重写里面的compare()方法。

### List和Set总结

- List,Set都是继承自	Collection接口，Map则不是
- **List特点**：元素有放入顺序，元素可重复
- **Set特点：**元素无放入顺序，元素不可重复，重复元素会覆盖掉，（注意：元素虽然无放入顺序，但是元素在set中的位置是有该元素的HashCode决定的，其位置其实是固定的，加入Set 的Object必须定义equals()方法 ，另外list支持for循环，也就是通过下标来遍历，也可以用迭代器，但是set只能用迭代，因为他无序，无法用下标来取得想要的值。）
- **Set**：检索元素效率低下，删除和插入效率高，插入和删除不会引起元素位置改变。
- **List**：和数组类似，List可以动态增长，查找元素效率高，插入删除元素效率低，因为会引起其他元素位置改变。

## Map详解

Map用于保存具有映射关系的数据，Map里保存着两组数据：key和value，它们都可以使任何引用类型的数据，但key不能重复。所以通过指定的key就可以取出对应的value。

Map接口有四个比较重要的实现类

- HashMap
- LinkedHashMap
- TreeMap
- HashTable。

TreeMap是有序的，HashMap和HashTable是无序的。

Hashtable的方法是同步的，HashMap的方法不是同步的。这是两者最主要的区别。

Map 没有继承 Collection 接口， Map 提供 key 到 value 的映射，你可以通过“键”查找“值”。一个 Map 中不能包含相同的 key ，每个 key 只能映射一个 value 。 Map 接口提供 3 种集合的视图， Map 的内容可以被当作一组 key 集合，一组 value 集合，或者一组 key-value 映射。

### Map常用方法

```java
public void clear();//清空map
public boolean containsKey(Object key);
public boolean containsValue(Object value);
public Set<Map.Entry<K,V>> entrySet();//返回map中键值对所组成的set集合
public V get(Object key);
public boolean isEmpty();
public Set<K> keySet();//返回键所组成的set集合
public V put(K key, V value);
public void putAll(Map<? extends K, ? extends V> m);
public V remove(Object key);
public int size();
public Collection<V> values(); //返回value所组成的collection
//内部类entry
K getKey(); //返回该entry里所包含的key
V getValue();//返回该entry里所包含的value
V setValue(V value);//设置value并返回旧的value
```

### HashMap和HashTable的比较

HashMap不支持线程的同步，即任一时刻可以有多个线程同时写HashMap;可能会导致数据的不一致。如果需要同步，可以用  Collections的synchronizedMap方法使HashMap具有同步的能力，或者使用ConcurrentHashMap。

- **线程安全**：HashTable线程安全
- **空值**：HashTable不能放入null，HashMap允许一个null为key，无数null为value

### TreeMap

实现SortMap接口，基于红黑树，对所有key排序，分为自然排序和定制排序

### Map的遍历

```java
import java.util.HashMap;  
import java.util.Iterator;  
import java.util.Map;  
   
public class Test {     
    
    public static void main(String[] args) {     
         Map<String, String> map = new HashMap<String, String>();     
         map.put("first", "linlin");     
         map.put("second", "好好学java");     
         map.put("third", "sihai");    
         map.put("first", "sihai2");   
     
     
         // 第一种：通过Map.keySet遍历key和value     
         System.out.println("===================通过Map.keySet遍历key和value:===================");     
         for (String key : map.keySet()) {     
             System.out.println("key= " + key + "  and  value= " + map.get(key));     
         }     
              
         // 第二种：通过Map.entrySet使用iterator遍历key和value     
         System.out.println("===================通过Map.entrySet使用iterator遍历key和value:===================");     
         Iterator<Map.Entry<String, String>> it = map.entrySet().iterator();     
         while (it.hasNext()) {     
             Map.Entry<String, String> entry = it.next();     
             System.out.println("key= " + entry.getKey() + "  and  value= "    
                     + entry.getValue());     
         }     
     
         // 第三种：通过Map.entrySet遍历key和value     
         System.out.println("===================通过Map.entrySet遍历key和value:===================");     
         for (Map.Entry<String, String> entry : map.entrySet()) {     
             System.out.println("key= " + entry.getKey() + "  and  value= "    
                     + entry.getValue());     
         }     
     
         // 第四种：通过Map.values()遍历所有的value，但是不能遍历键key     
         System.out.println("===================通过Map.values()遍历所有的value:===================");     
         for (String v : map.values()) {     
             System.out.println("value= " + v);     
         }     
     }          
 }    
```

### 小结

- HashMap：非线程安全，基于哈希表实现。使用HashMap要求添加的键类明确定义了hashCode()和equals()[可以重写hashCode()和equals()]，为了优化HashMap空间的使用，您可以调优初始容量和负载因子。
- TreeMap：非线程安全基于红黑树实现。TreeMap没有调优选项，因为该树总处于平衡状态。

## 重点问题

### 说说 List, Set, Queue, Map 四者的区别？

- `List`(对付顺序的好帮手): 存储的元素是有序的、可重复的。
- `Set`(注重独一无二的性质): 存储的元素是无序的、不可重复的。
- `Queue`(实现排队功能的叫号机): 按特定的排队规则来确定先后顺序，存储的元素是有序的、可重复的。
- `Map`(用 key 来搜索的专家): 使用键值对（key-value）存储，类似于数学上的函数 y=f(x)，"x" 代表 key，"y" 代表 value，key 是无序的、不可重复的，value 是无序的、可重复的，每个键最多映射到一个值。

### `ArrayList` 与 `LinkedList` 区别?

- 是否保证线程安全： `ArrayList` 和 `LinkedList` 都是不同步的，也就是不保证线程安全；

- 底层数据结构： `Arraylist` 底层使用的是 `Object` 数组；`LinkedList` 底层使用的是 双向链表 数据结构（JDK1.6之前为循环链表，JDK1.7取消了循环。）

- 插入和删除是否受元素位置的影响：

   ① `ArrayList` 采用数组存储，所以插入和删除元素的时间复杂度受元素位置的影响。 比如：执行add(E e)方法的时候， `ArrayList` 会默认在将指定的元素追加到此列表的末尾，这种情况时间复杂度就是O(1)。但是如果要在指定位置 i 插入和删除元素的话（add(int index, E element)）时间复杂度就为 O(n-i)。因为在进行上述操作的时候集合中第 i 和第 i 个元素之后的(n-i)个元素都要执行向后位/向前移一位的操作。

   ② `LinkedList`  采用链表存储，所以插入，删除元素时间复杂度不受元素位置的影响，都是近似 O（1）而数组为近似 O（n）。

- 是否支持快速随机访问： `LinkedList` 不支持高效的随机元素访问，而 `ArrayList` 支持。快速随机访问就是通过元素的序号快速获取元素对象(对应于`get(int index)`方法)。

- 内存空间占用： `ArrayList`的空 间浪费主要体现在在list列表的结尾会预留一定的容量空间，而`LinkedList` 的空间花费则体现在它的每一个元素都需要消耗比`ArrayList`更多的空间（因为要存放直接后继和直接前驱以及数据）。

### `ArrayList` 与 `Vector` 区别呢?为什么要用`ArrayList`取代`Vector`呢？

`Vector`类的所有方法都是同步的。可以由两个线程安全地访问一个`Vector`对象、但是一个线程访问`Vector`的话代码要在同步操作上耗费大量的时间。`Arraylist`不是同步的，所以在不需要保证线程安全时建议使用`ArrayList`。

### `HashMap `和 `Hashtable `的区别

- **线程是否安全**： HashMap 是非线程安全的，HashTable 是线程安全的；HashTable 内部的方法基本都经过`synchronized` 修饰。（如果你要保证线程安全的话就使用 ConcurrentHashMap 吧！）；
- **效率**： 因为线程安全的问题，HashMap 要比 HashTable 效率高一点。另外，HashTable 基本被淘汰，不要在代码中使用它；
- **对Null key 和Null value的支持**： HashMap 中，null 可以作为键，这样的键只有一个，可以有一个或多个键所对应的值为 null。。但是在 HashTable 中 put 进的键值只要有一个 null，直接抛出 NullPointerException。
- 初始容量大小和每次扩充容量大小的不同 ： ①创建时如果不指定容量初始值，Hashtable 默认的初始大小为11，之后每次扩充，容量变为原来的2n+1。HashMap 默认的初始化大小为16。之后每次扩充，容量变为原来的2倍。②创建时如果给定了容量初始值，那么 Hashtable 会直接使用你给定的大小，而 HashMap 会将其扩充为2的幂次方大小。也就是说 HashMap 总是使用2的幂作为哈希表的大小。
- **底层数据结构**： JDK1.8 以后的 HashMap 在解决哈希冲突时有了较大的变化，当链表长度大于阈值（默认为8）并且组长度是否大于64时，将链表转化为红黑树，以减少搜索时间。Hashtable 没有这样的机制。

### HashMap 和 HashSet区别

HashSet 底层就是基于 HashMap 实现的。（HashSet 的源码非常非常少，因为除了 clone()、writeObject()、readObject()是 HashSet 自己不得不实现之外，其他方法都是直接调用 HashMap 中的方法。

### HashMap的底层实现

JDK1.8之前

JDK1.8 之前 `HashMap` 底层是 数组和链表 结合在一起使用也就是 链表散列。 `HashMap` 通过 key 的 `hashCode `经过扰动函数处理过后得到 hash 值，然后通过 (n - 1) & hash 判断当前元素存放的位置（这里的 n 指的是数组的长度），如果当前位置存在元素的话，就判断该元素与要存入的元素的 hash 值以及 key 是否相同，如果相同的话，直接覆盖，不相同就通过拉链法解决冲突。

所谓扰动函数指的就是  `HashMap` 的 hash 方法。使用 hash 方法也就是扰动函数是为了防止一些实现比较差的 `hashCode() `方法 换句话说使用扰动函数之后可以减少碰撞。

`HashMap`实现原理（比较好的描述）：`HashMap`以键值对（key-value）的形式来储存元素，但调用put方法时，`HashMap`会通过hash函数来计算key的hash值，然后通过hash值&(HashMap.length-1)判断当前元素的存储位置，如果当前位置存在元素的话，就要判断当前元素与要存入的key是否相同，如果相同则覆盖，如果不同则通过拉链表来解决。JDk1.8时，当链表长度大于8并且组长度是否大于64时，将链表转为红黑树。

### `ConcurrentHashMap` 和` Hashtable `的区别

`ConcurrentHashMap `和 `Hashtable `的区别主要体现在实现线程安全的方式上不同。

- 底层数据结构： JDK1.7的 `ConcurrentHashMap` 底层采用 分段的数组+链表 实现，JDK1.8 采用的数据结构跟`HashMap`1.8的结构一样，数组+链表/红黑二叉树。`Hashtable `和 JDK1.8 之前的 `HashMap `的底层数据结构类似都是采用 数组+链表 的形式，数组是 `HashMap` 的主体，链表则是主要为了解决哈希冲突而存在的；
- 实现线程安全的方式（重要）： ① 在JDK1.7的时候，`ConcurrentHashMap`（分段锁） 对整个桶数组进行了分割分段(Segment)，每一把锁只锁容器其中一部分数据，多线程访问容器里不同数据段的数据，就不会存在锁竞争，提高并发访问率。 到了 JDK1.8 的时候已经摒弃了Segment的概念，而是直接用 Node 数组+链表+红黑树的数据结构来实现，并发控制使用 synchronized 和 CAS 来操作。（JDK1.6以后 对 synchronized锁做了很多优化） 整个看起来就像是优化过且线程安全的 `HashMap`，虽然在JDK1.8中还能看到 Segment 的数据结构，但是已经简化了属性，只是为了兼容旧版本；② `Hashtable`(同一把锁) 使用 synchronized 来保证线程安全，get/put所有相关操作都是synchronized的，这相当于给整个哈希表加了一把大锁，效率非常低下。当一个线程访问同步方法时，其他线程也访问同步方法，可能会进入阻塞或轮询状态，如使用 put 添加元素，另一个线程不能使用 put 添加元素，也不能使用 get，竞争会越来越激烈效率越低。

### `comparable `和 `Comparator`的区别

- comparable接口实际上是出自java.lang包 它有一个 `compareTo(Object obj)`方法用来排序
- comparator接口实际上是出自 java.util 包它有一个`compare(Object obj1, Object obj2)`方法用来排序