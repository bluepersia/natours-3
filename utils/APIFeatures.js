module.exports = class 
{
    constructor (reqQuery, query)
    {
        this.reqQuery = reqQuery;
        this.query = query;
    }

    filter ()
    {
        const filterBy = {...this.reqQuery};
        const exclude = ['sort', 'page', 'limit', 'fields'];
        exclude.forEach (el => delete filterBy[el]);

        let filterStr = JSON.stringify (filterBy);
        filterStr = filterStr.replace (/\b(lt|lte|gt|gte)\b/, match => `$${match}`);

        const filter = JSON.parse (filterStr);
        this.query.find (filter);
    }

    sort ()
    {
        this.query.sort (this.reqQuery.sort?.split (',').join (' ') || '-createdAt');

    }

    select ()
    {
        this.query.select (this.reqQuery.fields?.split (',').join (' ') || '-__v0');
    }

    paginate ()
    {
        const page = this.reqQuery.page || 1;
        const limit = this.reqQuery.limit || 100;
        const skip = (page - 1) * limit;

        this.query.skip (skip).limit (limit);
    }

    all ()
    {
        this.filter ();
        this.sort ();
        this.select ();
        this.paginate ();
    }
}