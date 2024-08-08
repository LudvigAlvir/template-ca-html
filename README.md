# noroff-test

## RAINYDAYS

An online shop selling men's and women’s rain jackets. They are designed for a range of different outdoor activities that enrich people's lives.

## Slogan

Pushing the Comfort Zone

## Target audience

Men and women aged 30 to 50 whose interests are: being outdoors, hiking, exploring, skiing, camping, canoeing

## Unique selling points

The jackets are mid-range in price and emphasize durability and being suitable for a range of different weather types ensuring customers are comfortable whatever adventure they go on.

## Site architecture

- Home (root)
- List of Jackets (/products)
- A jacket specific page showing the jacket (product details such as the description of the product, price and add to cart button) (/product)
- A checkout page (/checkout)
- A checkout success (/checkout-success)
- About (/about)
- Contact (/contact)

## requirements

This is a list of requirements for each page that need to be fullfilled to pass automatic testing.

### All pages

- All pages has to have titles, descripton and favicon.
- All pages has to have viewport meta tag, and html lang attributes
- All pages have header, main, footer.
- All pages have a nav element
- All pages have a unique h1
- All images must have alt text

### Home

- Has to have links to products, checkout, about and contact.

### List of Jackets

- Has to have a container with id "container-products" with at least 3 products inside.

### Contact

- Has to have a form with at least two fields with the ID's:
  - name
  - message

## Set up

To run tests locally need to have Node and NPM installed on your computer.
In your terminal run the command:

`npm i`

Then when you want to run the tests on your project run the command:

`npm run test`
