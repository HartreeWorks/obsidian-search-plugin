## Obsidian Search Plugin

This is a search plugin for Obsidian. 
It can be used to search files with titles containing keywords, sort them with title or last modified time, and also search file contents for any tag.   


Here's a list of functionalities this plugin provides: 
- Search across file titles for some keyword. 
- Search files with content containing particular tag.
- While listing the files sort them in order of title or last modified time. 
- Lists the file titles inline in the same Note.

### Installation

- clone this repo inside `.obsidian/plugins` directory of your vault. For ex - mine is in `/Users/sudobird/test-obsidian/.obsidian/plugins/obsidian-search-plugin`
- Run `npm install` and then `npm build`
- Sometimes esbuild gives error. Try using require in place of import in esbuild.config.mjs file
- After building the repo, restart Obsidian and go to settings -> community plugins -> toggle search plugin. 


### How to write command

- open and close the comment with lister.
- command delimiter is set to double semicolon.
- after writing this, you can click on the list link ribbon icon on left side. or you search for command lister. 

```
%%lister
title (contains/starts_with/ends_with) <exp>;;
order_by (title/mtime) (asc/desc);;
tag <exp>;;
/lister%%
```

Ex- 
```
%%lister
title contains hammer;;
order_by title desc;;
tag movies;;
/lister%%
```
