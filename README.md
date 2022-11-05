This is a serverless function built for Zealous's lock
When it receives a request, it will check if the user owns any token in a list of contract and if the user does, it will yield the right `data` object.

The endpoint will receive a GET request with the following:

network=5&
lockAddress=0xff32cd7ae5fc262a5fd957c26377170624b88f22&
recipient=0x81Dd955D02D337DB81BA6c9C5F6213E647672052

And needs to return a json object
{
data: '0x...'
}
