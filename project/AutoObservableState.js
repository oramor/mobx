import { makeAutoObservable, autorun } from 'mobx';

class State {
    constructor() {
        this._field1 = '';
        makeAutoObservable(this);
    }

    get field1() {
        return this._field1;
    }

    updField1(v) {
        this._field1 = v;
    }
}

const s = new State();

/**
 * Эта функция является оберткой для любого кода, который
 * должен быть выполнен при изменении отслеживаемого поля.
 */
autorun(() => {
    console.log('Reaction for ', s.field1);
});

/**
 * Хотя s.field1 является отслеживаемым полем, функция,
 * не будет вызвана повторно, т.к. не обернута
 * в autorun()
 */
const c1 = () => {
    console.log('From c1: ', s.field1);
};
c1();

/**
 * Чтобы mobx обновлял компоненты при изменении стейта,
 * необходимо обернуть компонент в autorun. Если это react-компонент,
 * используется observable, который всего лишь является адаптером
 * для autorun по работе с jsx-кодом
 */
const c2 = autorun(() => {
    console.log('From c2: ', s.field1);
});

/**
 * В реакте такой подход, похоже, не работает. Необходимо оборачивать
 * в observe все компоненты, которые должны реагировать на изменение стейта,
 * а здесь достаточно передать стейт из обернутого компонента.
 */
const c3 = (ctx) => {
    console.log('From c3: ', ctx.field1);
};

const c4 = autorun(() => {
    c3(s);
});

/**
 * Можно менять состояние из компонентов, которые не обернуты
 * в autorun (observer для react), но все компоненты которые
 * должны реагировать при изменении состояние должны быть
 * обернуты в эту функцию
 */
s.updField1('New value');
