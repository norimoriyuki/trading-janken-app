[private]
@default: help

alias h:= help
alias r:= run

@help:
    echo "Usage: just <recipe>"
    echo ""
    just --list

# いってらっしゃい
urls := '''
"https://i.ytimg.com/vi/e0G4u2caAVs/maxresdefault.jpg"
"https://i.ytimg.com/vi/Q7yYqYvp7dk/maxresdefault.jpg"
'''

@hello:
    chosen_url=$(echo "{{urls}}" | shuf -n 1) && curl -sS "https://img2txt.genzouw.com?url=${chosen_url}" && say "いってらっしゃい！"

init:
    yarn install

run:
    yarn start
