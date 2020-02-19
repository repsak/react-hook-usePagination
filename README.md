# react-hook-pagination

React Hook для использования пагинации
Генерация массива для отрисовки, вида:
(1) < {4 5} [6] {7 8} > (10)
 
|первая страница|переход влево|соседи|текущая|соседи|переход вправо|последняя страница|
|---------------|-------------|------|-------|------|--------------|------------------|
| (1)           | <           | {4 5}| [6]   | {7 8}| >            | (10)             |


## Использование

* @param {number} totalPages количество страниц
* @param {number} currentPage текущая страница
* @param {{}} opts конфигурируемые свойства
* @returns {Array{}}

### Конфигурируемые свойства
* @param {number} pageNeighbours количество "соседей" 
* @param {function} onPageClick колбэк при возникновении события
* @param {string} onPageClickPropName имя свойства при котором должно возникнуть событие (onClick, onFocus, ...etc)
* @param {string} leftChar символ перехода влево
* @param {string} rightChar символ перехода вправо


### Примеры

#### Без настроек, по умолчанию
```javascript
import usePagination from '@rylovnikita/react-hook-pagination';

function App(props) {
  const pages = usePagination(25, 10); // returns [{children: 1, onClick: () => console.log(1)}, ...]
  
  return <>
    {pages.map(pageProps => <button {...pageProps} />)}
  </>
}
```

### Переопределение свойств
```javascript
const pages = usePagination(25, 10, {
  pageNeighbours: 5,
  onPageClickPropName: 'onFocus',
  onPageClick: 'alert',
  leftChar: 'back',
  rightChar: 'forward'
})
```
