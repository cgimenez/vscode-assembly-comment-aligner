# VS Code Assembler comments aligner

A quick and dirty extension for align comments on specific columns when editing assembly files (eg. ca65)
Be warn that using this extension to any file without prior trying it with auto save disabled might lead to unpredictable results.

The extension only aligns comments positionned at the end of a line.
A comment preceded by only whitespaces will stay unmodified.

Settings :

- auto save : will align comments when file is saved
- column : the column where
- languages : the file language type to which align must be applied (eg. ca65)
- the comment symbol (; being the default) : be careful with this one

Install :

- download the .vsix file from the release directory and install the extension with vs code

**Enjoy! (or not)**
