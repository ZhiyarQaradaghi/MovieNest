import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:file_picker/file_picker.dart';
import 'package:http/http.dart' as http;
import 'dart:convert'; // JSON decoding

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Movie Nest',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        scaffoldBackgroundColor: Colors.grey[200],
        appBarTheme: AppBarTheme(
          backgroundColor: Colors.blueGrey[800],
          foregroundColor: Colors.white,
        ),
        buttonTheme: ButtonThemeData(
          buttonColor: Colors.blueGrey[700],
          textTheme: ButtonTextTheme.primary,
        ),
        textTheme: TextTheme(
          displayLarge: TextStyle(color: Colors.black87),
          displayMedium: TextStyle(color: Colors.black54),
          headlineMedium: TextStyle(color: Colors.white),
        ),
      ),
      home: const MyHomePage(title: 'Movie Nest'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});

  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  int _selectedIndex = 0;

  final List<Widget> _pages = [
    AddMoviePage(),
    MovieBrowserPage(),
    MovieLibraryPage(),
  ];

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
      ),
      body: _pages[_selectedIndex],
      bottomNavigationBar: BottomNavigationBar(
        items: const <BottomNavigationBarItem>[
          BottomNavigationBarItem(
            icon: Icon(Icons.add),
            label: 'Add Movie',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.movie),
            label: 'Movie Browser',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.library_books),
            label: 'Movie Library',
          ),
        ],
        currentIndex: _selectedIndex,
        onTap: _onItemTapped,
      ),
    );
  }
}

class AddMoviePage extends StatefulWidget {
  @override
  _AddMoviePageState createState() => _AddMoviePageState();
}

class _AddMoviePageState extends State<AddMoviePage> {
  var titleController = TextEditingController();
  var descriptionController = TextEditingController();
  var releaseYearController = TextEditingController();
  var genreController = TextEditingController();
  var directorsController = TextEditingController();
  var castController = TextEditingController();
  File? _image;

  Future<void> _pickImage() async {
    FilePickerResult? result =
        await FilePicker.platform.pickFiles(type: FileType.image);

    if (result != null) {
      setState(() {
        _image = File(result.files.single.path!);
      });
    }
  }

  void addMovie() async {
    if (_image == null) return;

    bool confirm = await showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Confirm Add Movie'),
          content: Text('Are you sure you want to add this movie?'),
          actions: <Widget>[
            TextButton(
              onPressed: () {
                Navigator.of(context).pop(false);
              },
              child: Text('Cancel'),
            ),
            TextButton(
              onPressed: () {
                Navigator.of(context).pop(true);
              },
              child: Text('Confirm'),
            ),
          ],
        );
      },
    );

    if (!confirm) return;

    var request = http.MultipartRequest(
      'POST',
      Uri.parse('http://10.0.2.2:8080/addMovie'),
    );
    request.fields['title'] = titleController.text;
    request.fields['description'] = descriptionController.text;
    request.fields['release_year'] = releaseYearController.text;
    request.fields['genre'] = genreController.text;
    request.fields['mov_directors'] = directorsController.text;
    request.fields['mov_cast'] = castController.text;

    request.files.add(await http.MultipartFile.fromPath('image', _image!.path));

    var response = await request.send();

    if (response.statusCode == 200) {
      titleController.clear();
      descriptionController.clear();
      releaseYearController.clear();
      genreController.clear();
      directorsController.clear();
      castController.clear();
      setState(() {
        _image = null;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Movie added successfully!')),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to add movie')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: EdgeInsets.all(16.0),
      children: [
        TextField(
          controller: titleController,
          decoration: InputDecoration(
            labelText: 'Title',
            border: OutlineInputBorder(),
          ),
        ),
        SizedBox(height: 10),
        TextField(
          controller: descriptionController,
          decoration: InputDecoration(
            labelText: 'Description',
            border: OutlineInputBorder(),
          ),
        ),
        SizedBox(height: 10),
        TextField(
          controller: releaseYearController,
          decoration: InputDecoration(
            labelText: 'Release Year',
            border: OutlineInputBorder(),
          ),
        ),
        SizedBox(height: 10),
        TextField(
          controller: genreController,
          decoration: InputDecoration(
            labelText: 'Genre',
            border: OutlineInputBorder(),
          ),
        ),
        SizedBox(height: 10),
        TextField(
          controller: directorsController,
          decoration: InputDecoration(
            labelText: 'Directors',
            border: OutlineInputBorder(),
          ),
        ),
        SizedBox(height: 5),
        Text(
          'Format: [{"name": "Name", "age": 50, "country": "Country"}]',
          style: TextStyle(fontSize: 12, color: Colors.grey),
        ),
        SizedBox(height: 10),
        TextField(
          controller: castController,
          decoration: InputDecoration(
            labelText: 'Cast',
            border: OutlineInputBorder(),
          ),
        ),
        SizedBox(height: 5),
        Text(
          'Format: [{"name": "Name", "age": 30, "country": "Country"}]',
          style: TextStyle(fontSize: 12, color: Colors.grey),
        ),
        SizedBox(height: 20),
        ElevatedButton(
          onPressed: _pickImage,
          child: Text('Pick Image'),
        ),
        SizedBox(height: 10),
        _image != null
            ? Image.file(
                _image!,
                height: 150,
              )
            : Container(),
        SizedBox(height: 20),
        ElevatedButton(
          onPressed: addMovie,
          child: Text('Add Movie'),
        ),
      ],
    );
  }
}

class MovieBrowserPage extends StatefulWidget {
  @override
  _MovieBrowserPageState createState() => _MovieBrowserPageState();
}

class _MovieBrowserPageState extends State<MovieBrowserPage> {
  var movies = [];
  var filteredMovies = [];
  TextEditingController searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    fetchMovies();
    searchController.addListener(() {
      filterMovies();
    });
  }

  void fetchMovies() async {
    var response = await http.get(Uri.parse("http://10.0.2.2:8080/movies"));
    var body = jsonDecode(utf8.decode(response.bodyBytes));

    setState(() {
      movies = body;
      filteredMovies = body;
    });
  }

  void filterMovies() {
    String query = searchController.text.toLowerCase();
    setState(() {
      filteredMovies = movies.where((movie) {
        return movie['title'].toLowerCase().contains(query);
      }).toList();
    });
  }

  void addToLibrary(int movieId) async {
    await http.post(
      Uri.parse('http://10.0.2.2:8080/addmovietolibrary'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'movieId': movieId}),
    );
    fetchMovies();
  }

  void toggleLike(int movieId) async {
    await http.post(
      Uri.parse('http://10.0.2.2:8080/toggleLike/$movieId'),
    );
    fetchMovies();
  }

  void viewMovieDetails(int movieId) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => MovieDetailsPage(movieId: movieId),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.all(16.0),
          child: TextField(
            controller: searchController,
            decoration: InputDecoration(
              labelText: 'Search Movies',
              border: OutlineInputBorder(),
              prefixIcon: Icon(Icons.search),
            ),
          ),
        ),
        Expanded(
          child: GridView.builder(
            gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              crossAxisSpacing: 8.0,
              mainAxisSpacing: 8.0,
            ),
            padding: EdgeInsets.all(16.0),
            itemCount: filteredMovies.length,
            itemBuilder: (context, index) {
              var movie = filteredMovies[index];
              var isLiked = movie['liked'] ?? false;
              return Card(
                margin: EdgeInsets.zero,
                child: Row(
                  children: [
                    GestureDetector(
                      onTap: () => viewMovieDetails(movie['id']),
                      child: Image.network(
                        'http://10.0.2.2:8080/images/${movie['image']}',
                        height: 150,
                        width: 100,
                        fit: BoxFit.cover,
                      ),
                    ),
                    SizedBox(width: 8.0),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Padding(
                            padding: const EdgeInsets.all(8.0),
                            child: Text(
                              movie['title'] ?? 'No title available',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                          Padding(
                            padding:
                                const EdgeInsets.symmetric(horizontal: 8.0),
                            child: Column(
                              children: [
                                IconButton(
                                  icon: Icon(isLiked
                                      ? Icons.thumb_up
                                      : Icons.thumb_up_off_alt),
                                  onPressed: () => toggleLike(movie['id']),
                                ),
                                Text('${movie['likes'] ?? 0}'),
                                IconButton(
                                  icon: Icon(Icons.library_add),
                                  onPressed: () => addToLibrary(movie['id']),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              );
            },
          ),
        ),
      ],
    );
  }
}

class MovieLibraryPage extends StatefulWidget {
  @override
  _MovieLibraryPageState createState() => _MovieLibraryPageState();
}

class _MovieLibraryPageState extends State<MovieLibraryPage> {
  var movies = <Map<String, dynamic>>[];

  @override
  void initState() {
    super.initState();
    fetchLibraryMovies();
  }

  Future<void> fetchLibraryMovies() async {
    try {
      var response =
          await http.get(Uri.parse("http://10.0.2.2:8080/showlibrarymovies"));
      if (response.statusCode == 200) {
        var body = jsonDecode(utf8.decode(response.bodyBytes)) as List<dynamic>;
        setState(() {
          movies = body.cast<Map<String, dynamic>>();
        });
      } else {
        throw Exception('Failed to load movies');
      }
    } catch (e) {
      print('Error fetching movies: $e');
    }
  }

  Future<void> removeFromLibrary(int movieId) async {
    try {
      await http.post(
        Uri.parse('http://10.0.2.2:8080/removefromlibrary'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'movieId': movieId}),
      );
      fetchLibraryMovies();
    } catch (e) {
      print('Error removing movie: $e');
    }
  }

  void viewMovieDetails(int movieId) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => MovieDetailsPage(movieId: movieId),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return GridView.builder(
      gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 8.0,
        mainAxisSpacing: 8.0,
      ),
      padding: EdgeInsets.all(16.0),
      itemCount: movies.length,
      itemBuilder: (context, index) {
        var movie = movies[index];
        return Card(
          margin: EdgeInsets.zero,
          child: Row(
            children: [
              Image.network(
                'http://10.0.2.2:8080/images/${movie['image']}',
                height: 150,
                width: 100,
                fit: BoxFit.cover,
              ),
              SizedBox(width: 8.0),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Padding(
                      padding: const EdgeInsets.all(8.0),
                      child: Text(
                        movie['title'] ?? 'No title available',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    // Buttons Column
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 8.0),
                      child: Column(
                        children: [
                          IconButton(
                            icon: Icon(Icons.delete, size: 20),
                            onPressed: () => removeFromLibrary(movie['id']),
                          ),
                          IconButton(
                            icon: Icon(Icons.info_outline, size: 20),
                            onPressed: () => viewMovieDetails(movie['id']),
                          ),
                        ],
                      ),
                    ),
                    Spacer(),
                    Padding(
                      padding: const EdgeInsets.all(8.0),
                      child: Text(
                        '${movie['likes'] ?? 0} Likes',
                        style: TextStyle(fontSize: 14),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}

class MovieDetailsPage extends StatefulWidget {
  final int movieId;

  MovieDetailsPage({required this.movieId});

  @override
  _MovieDetailsPageState createState() => _MovieDetailsPageState();
}

class _MovieDetailsPageState extends State<MovieDetailsPage> {
  Map<String, dynamic>? _movie;
  List<String> _comments = [];
  final TextEditingController _commentController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _fetchMovieDetails();
    _fetchComments();
  }

  void _fetchMovieDetails() async {
    try {
      var response = await http
          .get(Uri.parse('http://10.0.2.2:8080/movies/${widget.movieId}'));
      if (response.statusCode == 200) {
        var movie = jsonDecode(utf8.decode(response.bodyBytes));
        setState(() {
          _movie = movie;
        });
      } else {
        throw Exception('Failed to load movie details: ${response.statusCode}');
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to load movie details: $e')),
      );
    }
  }

  void _showEditDialog() {
    if (_movie == null) return;

    final titleController = TextEditingController(text: _movie!['title'] ?? '');
    final descriptionController =
        TextEditingController(text: _movie!['description'] ?? '');
    final releaseYearController = TextEditingController(
        text: (_movie!['release_year']?.toString()) ?? '');
    final genreController = TextEditingController(text: _movie!['genre'] ?? '');
    final directorsController =
        TextEditingController(text: _movie!['directors'] ?? '');
    final castController = TextEditingController(text: _movie!['cast'] ?? '');

    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: Text('Edit Movie Details'),
          content: SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                TextField(
                  controller: titleController,
                  decoration: InputDecoration(labelText: 'Title'),
                ),
                TextField(
                  controller: descriptionController,
                  decoration: InputDecoration(labelText: 'Description'),
                ),
                TextField(
                  controller: releaseYearController,
                  decoration: InputDecoration(labelText: 'Release Year'),
                  keyboardType: TextInputType.number,
                ),
                TextField(
                  controller: genreController,
                  decoration: InputDecoration(labelText: 'Genre'),
                ),
                TextField(
                  controller: directorsController,
                  decoration:
                      InputDecoration(labelText: 'Directors (JSON format)'),
                ),
                TextField(
                  controller: castController,
                  decoration: InputDecoration(labelText: 'Cast (JSON format)'),
                ),
              ],
            ),
          ),
          actions: [
            TextButton(
              onPressed: () async {
                try {
                  var response = await http.post(
                    Uri.parse('http://10.0.2.2:8080/movies/${widget.movieId}'),
                    headers: {'Content-Type': 'application/json'},
                    body: jsonEncode({
                      'title': titleController.text,
                      'description': descriptionController.text,
                      'release_year':
                          int.tryParse(releaseYearController.text) ?? 0,
                      'genre': genreController.text,
                      'directors': directorsController.text,
                      'cast': castController.text,
                    }),
                  );

                  if (response.statusCode == 200) {
                    Navigator.of(context).pop();
                    _fetchMovieDetails();
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text('Movie updated successfully!')),
                    );
                  } else {
                    throw Exception(
                        'Failed to update movie details: ${response.statusCode}');
                  }
                } catch (e) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text('Failed to update movie')),
                  );
                }
              },
              child: Text('Save'),
            ),
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: Text('Cancel'),
            ),
          ],
        );
      },
    );
  }

  void _fetchComments() async {
    try {
      var response = await http
          .get(Uri.parse('http://10.0.2.2:8080/comments/${widget.movieId}'));
      if (response.statusCode == 200) {
        var data = jsonDecode(utf8.decode(response.bodyBytes));
        setState(() {
          _comments = List<String>.from(data['comments']);
        });
      } else {
        throw Exception('Failed to load comments: ${response.statusCode}');
      }
    } catch (e) {
      ScaffoldMessenger.of(context)
          .showSnackBar(SnackBar(content: Text('Failed to load comments: $e')));
    }
  }

  void _submitComment() async {
    final comment = _commentController.text;
    if (comment.isEmpty) return;

    final timestamp = DateTime.now().toLocal().toString();
    final commentWithTimestamp = '$timestamp: $comment';

    try {
      var response = await http.post(
        Uri.parse('http://10.0.2.2:8080/comment'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'movieId': widget.movieId,
          'comment': commentWithTimestamp,
        }),
      );

      if (response.statusCode == 200) {
        _commentController.clear();
        _fetchComments();
        ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Comment added successfully!')));
      } else {
        throw Exception('Failed to add comment');
      }
    } catch (e) {
      ScaffoldMessenger.of(context)
          .showSnackBar(SnackBar(content: Text('Failed to add comment: $e')));
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_movie == null) {
      return Scaffold(
        appBar: AppBar(title: Text('Movie Details')),
        body: Center(child: CircularProgressIndicator()),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: Text('Movie Details'),
        actions: [
          IconButton(
            icon: Icon(Icons.edit),
            onPressed: _showEditDialog,
          ),
        ],
      ),
      body: Padding(
        padding: EdgeInsets.all(16.0),
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildMovieDetails(),
              SizedBox(height: 20),
              TextField(
                controller: _commentController,
                decoration: InputDecoration(
                  labelText: 'Add a comment',
                  border: OutlineInputBorder(),
                ),
                maxLines: 3,
              ),
              SizedBox(height: 10),
              ElevatedButton(
                onPressed: _submitComment,
                child: Text('Submit Comment'),
              ),
              SizedBox(height: 20),
              Text(
                'Comments:',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              ..._comments.map((comment) {
                final split = comment.split(': ');
                final timestamp = split.first;
                final commentText =
                    split.length > 1 ? split.sublist(1).join(': ') : '';

                return Card(
                  margin: EdgeInsets.symmetric(vertical: 10),
                  child: Padding(
                    padding: const EdgeInsets.all(8.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(commentText, style: TextStyle(fontSize: 16)),
                        SizedBox(height: 5),
                        Align(
                          alignment: Alignment.bottomRight,
                          child: Text(timestamp,
                              style: TextStyle(color: Colors.grey)),
                        ),
                      ],
                    ),
                  ),
                );
              }).toList(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildMovieDetails() {
    var movie = _movie!;
    List<Map<String, dynamic>> directors =
        parseJsonList(movie['directors'] ?? '[]');
    List<Map<String, dynamic>> cast = parseJsonList(movie['cast'] ?? '[]');

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          movie['title'] ?? 'No title available',
          style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
        ),
        SizedBox(height: 10),
        movie['image'] != null
            ? Image.network('http://10.0.2.2:8080/images/${movie['image']}',
                fit: BoxFit.cover)
            : SizedBox.shrink(),
        SizedBox(height: 10),
        Text(
            'Description: ${movie['description'] ?? 'No description available'}',
            style: TextStyle(fontSize: 16)),
        SizedBox(height: 10),
        Text(
            'Release Year: ${movie['release_year'] ?? 'No release year available'}',
            style: TextStyle(fontSize: 16)),
        SizedBox(height: 10),
        Text('Genre: ${movie['genre'] ?? 'No genre available'}',
            style: TextStyle(fontSize: 16)),
        SizedBox(height: 10),
        Text('Directors:',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
        ...directors.map((director) => Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Name: ${director['name'] ?? 'N/A'}'),
                Text('Age: ${director['age'] ?? 'N/A'}'),
                Text('Country: ${director['country'] ?? 'N/A'}'),
                SizedBox(height: 10),
              ],
            )),
        SizedBox(height: 10),
        Text('Cast:',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
        ...cast.map((actor) => Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Name: ${actor['name'] ?? 'N/A'}'),
                Text('Age: ${actor['age'] ?? 'N/A'}'),
                Text('Country: ${actor['country'] ?? 'N/A'}'),
                SizedBox(height: 10),
              ],
            )),
      ],
    );
  }

  List<Map<String, dynamic>> parseJsonList(String jsonString) {
    try {
      return List<Map<String, dynamic>>.from(jsonDecode(jsonString));
    } catch (e) {
      print('Error parsing JSON: $e');
      return [];
    }
  }
}
