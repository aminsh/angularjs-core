export class ODataQueryBuilder {
    constructor(promise, request, environment) {
        this.promise = promise;
        this.request = request;
        this.Environment = environment;
        this.rootUrl = environment.ROOT_URL;

        this.endpoint = '';

        this.initConfig();
    }

    clone() {
        const instance = new ODataQueryBuilder(this.promise, this.request, this.Environment);

        instance.initConfig();
        instance.config.id = this.config.id;
        instance.endpoint = this.endpoint;
        instance.config.where = this.config.where.map(e => typeof e === "string" ? e : Object.assign({}, e));
        instance.config.orderBy = this.config.orderBy.map(e => typeof e === "string" ? e : Object.assign({}, e));
        instance.config.include = this.config.include.map(e => typeof e === "string" ? e : Object.assign({}, e));
        instance.config.take = this.config.take;
        instance.config.skip = this.config.skip;
        instance.config.queryString = this.config.queryString;

        return instance;
    }


    initConfig() {
        this.config = {
            id: null,
            single: false,
            where: [],
            orderBy: [],
            select: null,
            include: [],
            take: 20,
            skip: 0,
            queryString: null,
            inlineCount: false,
            paging: true
        };
    }

    from(endpoint) {
        this.endpoint = endpoint;
        return this;
    }

    find(id) {
        const instance = this.clone();
        instance.config.id = id;
        return instance.execute();
    }

    single() {
        const instance = this.clone();
        instance.config.single = true;
        return instance.execute();
    }

    firstOrDefault(field, operator, value, defaultValue = null) {
        let instance = this.clone();

        if (field)
            instance = instance.where(field, operator, value);

        instance = instance.take(1);

        return this.promise.create((resolve, reject) => {
            instance.execute()
                .then(result => {
                    const value = result.value;
                    if (value.length > 0)
                        resolve(value[0]);
                    else
                        resolve(defaultValue);
                })
                .catch(e => reject(e));
        });
    }

    select(fields) {
        let instance = this.clone();
        instance.config.select = fields;
        return instance;
    }

    include(association) {
        let instance = this.clone();
        instance.config.include.push(association);
        return instance;
    }

    where(field, operator, value) {
        let instance = this.clone();
        instance.config.where.push({ field, operator, value });
        return instance;
    }

    whereRaw(whereClause) {
        let instance = this.clone();
        instance.config.where.push(whereClause);
        return instance;
    }

    orderBy(field) {
        let instance = this.clone();
        instance.config.orderBy.push({ field, dir: 'asc' });
        return instance;
    }

    orderByDescending(field) {
        let instance = this.clone();
        instance.config.orderBy.push({ field, dir: 'desc' });
        return instance;
    }

    take(num) {
        let instance = this.clone();
        instance.config.take = num;
        return instance;
    }

    skip(num) {
        let instance = this.clone();
        instance.config.skip = num;
        return instance;
    }

    useInlineCount() {
        let instance = this.clone();
        instance.config.inlineCount = true;
        return instance;
    }

    disablePaging() {
        let instance = this.clone();
        instance.config.paging = false;
        return instance;
    }

    _getHeader(header) {
        const base = { "api-caller": "STORM-Dashboard", "Cache-Control": "no-cache" };
        return Object.assign({}, base, header);
    }

    _parseCollectionParams() {
        const config = this.config;

        let query = {};

        if (config.paging === true) {
            if (config.take)
                query.$top = config.take;

            if (config.skip)
                query.$skip = config.skip;
        }

        if (config.select)
            query.$select = config.select;

        if (config.inlineCount)
            query.$count = true;

        if (config.orderBy.length > 0)
            query.$orderby = config.orderBy.map(e => `${ e.field } ${ e.dir }`).join(',');

        function mapValue(value) {
            if (typeof value === 'string')
                return `'${ value }'`;
            return value;
        }

        if (config.where.length > 0)
            query.$filter = config.where.map(e => typeof e === 'string'
                ? e
                : `${ e.field } ${ e.operator } ${ mapValue(e.value) }`)
                .join(' and ');

        return query;
    }

    _parseInclude() {
        const config = this.config;

        if (config.include.length > 0)
            return { $expand: config.include.join(',') }
    }

    _parseKendoParameters(parameters) {
        const instance = this.clone();

        const where = [],
            orderBy = [];

        const filters = (parameters.filter || { filters: [] }).filters,
            sort = (parameters.sort || []);

        const operatorsMapping = {
            eq: 'eq',
            ne: 'ne',
            gt: 'gt',
            gte: 'ge',
            lt: 'lt',
            lte: 'le'
        };

        filters.forEach(filter => {
            if (Object.keys(operatorsMapping).includes(filter.operator))
                where.push({ field: filter.field, operator: operatorsMapping[filter.operator], value: filter.value });

            if (filter.operator === 'contains')
                where.push(`contains(${ filter.field }, '${ filter.value }')`);

            if (filter.operator === 'startswith')
                where.push(`startswith(${ filter.field }, '${ filter.value }')`);

            if (filter.operator === 'endswith')
                where.push(`endswith(${ filter.field }, '${ filter.value }')`);

            if (filter.operator === 'isNull')
                where.push(`${ filter.field } eq null`);

            if (filter.operator === 'isNotNull')
                where.push(`not(${ filter.field } eq null)`);

            if (filter.operator === 'isTrue')
                where.push(`${ filter.field } eq true`);

            if (filter.operator === 'isFalse')
                where.push(`${ filter.field } eq false`);

            if (filter.operator === 'in') {
                const values = filter.value.map(e => typeof e === 'string' ? `'${ e }'` : e).join(',');
                where.push(`${ filter.field } in (${ values })`);
            }

            if (filter.operator === 'notIn') {
                const values = filter.value.map(e => typeof e === 'string' ? `'${ e }'` : e).join(',');
                where.push(`not(${ filter.field } in (${ values }))`);
            }

            if (filter.operator === 'raw') {
                where.push(filter.expression);
            }

            if (filter.operator === 'between') {
                let one = filter.value[0],
                    two = filter.value[1];

                one = typeof one === 'string' ? `'${ one }'` : one;
                two = typeof two === 'string' ? `'${ two }'` : two;

                where.push(`${ filter.field } ge ${ one } and ${ filter.field } le ${ two }`);
            }
        });

        sort.forEach(e => {
            const item = this.config.orderBy.asEnumerable().firstOrDefault(o => o.field === e.field);

            if (item) {
                item.dir = e.dir;
                return;
            }

            if (e.dir === 'asc')
                orderBy.push({ field: e.field, dir: 'asc' });
            if (e.dir === 'desc')
                orderBy.push({ field: e.field, dir: 'desc' });
        });

        if (parameters.paging === false)
            instance.config.paging = false;
        else {
            if (parameters.take)
                instance.config.take = parameters.take;

            if (parameters.skip)
                instance.config.skip = parameters.skip;
        }

        instance.config.inlineCount = true;

        instance.config.where = [ ...instance.config.where, ...where ];
        instance.config.orderBy = [ ...instance.config.orderBy, ...orderBy ];

        return instance;
    }

    setQueryString(queryString) {
        const instance = this.clone();

        instance.config.queryString = queryString;

        return instance;
    }

    executeAsKendo(parameters) {
        const instance = this.clone();

        if (parameters.hasOwnProperty('paging'))
            instance.paging = parameters.paging;

        return this.promise.create((resolve, reject) => {
            instance._parseKendoParameters(parameters).execute()
                .then(result => {
                    if (parameters.paging === false)
                        resolve(result.value);
                    else
                        resolve({ data: result.value, total: result["@odata.count"] });
                })
                .catch(error => {
                    reject(error);
                    console.log(error);
                });
        });
    }

    execute() {
        let url = `${ this.rootUrl }/${ this.endpoint }`;

        let params = this._parseInclude();

        if (this.config.id)
            url = `${ url }('${ this.config.id }')`;

        if (!this.config.id && !this.config.single)
            params = Object.assign({}, params, this._parseCollectionParams());

        if (this.config.queryString)
            params = Object.assign({}, params, this.config.queryString);

        return this.request.get(url, params);
    }
}
