cat src/* src/*/* | sed '/^\s*$/d' | sed '/^[ /]*[*]/d' | sed '/^[ ]*[/][/]/d' | wc -l